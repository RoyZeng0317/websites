from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from config import CORS_ORIGINS
from database import Base, engine, get_session
from b2_storage import download_db, upload_db
from models import (
    IdolGroup, Idol, GroupMember, Album, Song, AlbumSong, Concert, Award,
)
from schemas import (
    IdolGroupCreate, IdolGroupUpdate, IdolGroupResponse,
    IdolCreate, IdolUpdate, IdolResponse,
    GroupMemberCreate, GroupMemberResponse,
    AlbumCreate, AlbumResponse,
    SongCreate, SongResponse,
    ConcertCreate, ConcertResponse,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    download_db()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


def _sync_b2():
    """在背景同步資料庫到 B2"""
    try:
        upload_db()
    except Exception:
        pass


app = FastAPI(title="Idol Info API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===================== Idol Groups =====================

@app.get("/api/groups", response_model=List[IdolGroupResponse])
async def list_groups(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(IdolGroup).offset(skip).limit(limit).order_by(IdolGroup.id))
    return result.scalars().all()


@app.get("/api/groups/{group_id}", response_model=IdolGroupResponse)
async def get_group(group_id: int, session: AsyncSession = Depends(get_session)):
    group = await session.get(IdolGroup, group_id)
    if not group:
        raise HTTPException(404, "Group not found")
    return group


@app.post("/api/groups", response_model=IdolGroupResponse, status_code=201)
async def create_group(data: IdolGroupCreate, session: AsyncSession = Depends(get_session)):
    group = IdolGroup(**data.model_dump())
    session.add(group)
    await session.commit()
    await session.refresh(group)
    _sync_b2()
    return group


@app.patch("/api/groups/{group_id}", response_model=IdolGroupResponse)
async def update_group(group_id: int, data: IdolGroupUpdate, session: AsyncSession = Depends(get_session)):
    group = await session.get(IdolGroup, group_id)
    if not group:
        raise HTTPException(404, "Group not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(group, key, val)
    await session.commit()
    await session.refresh(group)
    _sync_b2()
    return group


@app.delete("/api/groups/{group_id}", status_code=204)
async def delete_group(group_id: int, session: AsyncSession = Depends(get_session)):
    group = await session.get(IdolGroup, group_id)
    if not group:
        raise HTTPException(404, "Group not found")
    await session.delete(group)
    await session.commit()
    _sync_b2()


# ===================== Idols =====================

@app.get("/api/idols", response_model=List[IdolResponse])
async def list_idols(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(Idol).offset(skip).limit(limit).order_by(Idol.id))
    return result.scalars().all()


@app.get("/api/idols/{idol_id}", response_model=IdolResponse)
async def get_idol(idol_id: int, session: AsyncSession = Depends(get_session)):
    idol = await session.get(Idol, idol_id)
    if not idol:
        raise HTTPException(404, "Idol not found")
    return idol


@app.post("/api/idols", response_model=IdolResponse, status_code=201)
async def create_idol(data: IdolCreate, session: AsyncSession = Depends(get_session)):
    idol = Idol(**data.model_dump())
    session.add(idol)
    await session.commit()
    await session.refresh(idol)
    _sync_b2()
    return idol


@app.patch("/api/idols/{idol_id}", response_model=IdolResponse)
async def update_idol(idol_id: int, data: IdolUpdate, session: AsyncSession = Depends(get_session)):
    idol = await session.get(Idol, idol_id)
    if not idol:
        raise HTTPException(404, "Idol not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(idol, key, val)
    await session.commit()
    await session.refresh(idol)
    _sync_b2()
    return idol


@app.delete("/api/idols/{idol_id}", status_code=204)
async def delete_idol(idol_id: int, session: AsyncSession = Depends(get_session)):
    idol = await session.get(Idol, idol_id)
    if not idol:
        raise HTTPException(404, "Idol not found")
    await session.delete(idol)
    await session.commit()
    _sync_b2()


# ===================== Group Members =====================

@app.get("/api/groups/{group_id}/members", response_model=List[GroupMemberResponse])
async def list_group_members(group_id: int, session: AsyncSession = Depends(get_session)):
    group = await session.get(IdolGroup, group_id)
    if not group:
        raise HTTPException(404, "Group not found")
    result = await session.execute(
        select(GroupMember).where(GroupMember.group_id == group_id)
    )
    return result.scalars().all()


@app.post("/api/group-members", response_model=GroupMemberResponse, status_code=201)
async def add_group_member(data: GroupMemberCreate, session: AsyncSession = Depends(get_session)):
    gm = GroupMember(**data.model_dump())
    session.add(gm)
    await session.commit()
    await session.refresh(gm)
    _sync_b2()
    return gm


@app.delete("/api/group-members/{gm_id}", status_code=204)
async def remove_group_member(gm_id: int, session: AsyncSession = Depends(get_session)):
    gm = await session.get(GroupMember, gm_id)
    if not gm:
        raise HTTPException(404, "Group member not found")
    await session.delete(gm)
    await session.commit()
    _sync_b2()


# ===================== Albums =====================

@app.get("/api/albums", response_model=List[AlbumResponse])
async def list_albums(
    group_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Album).offset(skip).limit(limit).order_by(Album.release_date.desc().nullslast())
    if group_id is not None:
        stmt = stmt.where(Album.group_id == group_id)
    result = await session.execute(stmt)
    return result.scalars().all()


@app.get("/api/albums/{album_id}", response_model=AlbumResponse)
async def get_album(album_id: int, session: AsyncSession = Depends(get_session)):
    album = await session.get(Album, album_id)
    if not album:
        raise HTTPException(404, "Album not found")
    return album


@app.post("/api/albums", response_model=AlbumResponse, status_code=201)
async def create_album(data: AlbumCreate, session: AsyncSession = Depends(get_session)):
    album = Album(**data.model_dump())
    session.add(album)
    await session.commit()
    await session.refresh(album)
    _sync_b2()
    return album


@app.delete("/api/albums/{album_id}", status_code=204)
async def delete_album(album_id: int, session: AsyncSession = Depends(get_session)):
    album = await session.get(Album, album_id)
    if not album:
        raise HTTPException(404, "Album not found")
    await session.delete(album)
    await session.commit()
    _sync_b2()


# ===================== Songs =====================

@app.get("/api/songs", response_model=List[SongResponse])
async def list_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(Song).offset(skip).limit(limit).order_by(Song.id))
    return result.scalars().all()


@app.post("/api/songs", response_model=SongResponse, status_code=201)
async def create_song(data: SongCreate, session: AsyncSession = Depends(get_session)):
    song = Song(**data.model_dump())
    session.add(song)
    await session.commit()
    await session.refresh(song)
    _sync_b2()
    return song


# ===================== Concerts =====================

@app.get("/api/concerts", response_model=List[ConcertResponse])
async def list_concerts(
    group_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Concert).offset(skip).limit(limit).order_by(Concert.concert_date.desc().nullslast())
    if group_id is not None:
        stmt = stmt.where(Concert.group_id == group_id)
    result = await session.execute(stmt)
    return result.scalars().all()


@app.post("/api/concerts", response_model=ConcertResponse, status_code=201)
async def create_concert(data: ConcertCreate, session: AsyncSession = Depends(get_session)):
    concert = Concert(**data.model_dump())
    session.add(concert)
    await session.commit()
    await session.refresh(concert)
    _sync_b2()
    return concert


@app.delete("/api/concerts/{concert_id}", status_code=204)
async def delete_concert(concert_id: int, session: AsyncSession = Depends(get_session)):
    concert = await session.get(Concert, concert_id)
    if not concert:
        raise HTTPException(404, "Concert not found")
    await session.delete(concert)
    await session.commit()
    _sync_b2()


# ===================== Health Check =====================

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
