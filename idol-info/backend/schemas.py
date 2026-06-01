from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


# === IdolGroup ===
class IdolGroupBase(BaseModel):
    name: str
    name_zh: Optional[str] = None
    name_ja: Optional[str] = None
    name_ko: Optional[str] = None
    debut_date: Optional[date] = None
    agency: Optional[str] = None
    label: Optional[str] = None
    country: Optional[str] = "JP"
    status: Optional[str] = "active"
    image_url: Optional[str] = None
    biography: Optional[str] = None


class IdolGroupCreate(IdolGroupBase):
    pass


class IdolGroupUpdate(BaseModel):
    name: Optional[str] = None
    name_zh: Optional[str] = None
    name_ja: Optional[str] = None
    name_ko: Optional[str] = None
    debut_date: Optional[date] = None
    agency: Optional[str] = None
    label: Optional[str] = None
    country: Optional[str] = None
    status: Optional[str] = None
    image_url: Optional[str] = None
    biography: Optional[str] = None


class IdolGroupResponse(IdolGroupBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# === Idol ===
class IdolBase(BaseModel):
    stage_name: str
    stage_name_zh: Optional[str] = None
    stage_name_ja: Optional[str] = None
    stage_name_ko: Optional[str] = None
    real_name: Optional[str] = None
    nickname: Optional[str] = None
    birth_date: Optional[date] = None
    birthplace: Optional[str] = None
    blood_type: Optional[str] = None
    height_cm: Optional[int] = None
    zodiac_sign: Optional[str] = None
    image_url: Optional[str] = None
    biography: Optional[str] = None
    social_media: Optional[dict] = None


class IdolCreate(IdolBase):
    pass


class IdolUpdate(BaseModel):
    stage_name: Optional[str] = None
    stage_name_zh: Optional[str] = None
    stage_name_ja: Optional[str] = None
    stage_name_ko: Optional[str] = None
    real_name: Optional[str] = None
    nickname: Optional[str] = None
    birth_date: Optional[date] = None
    birthplace: Optional[str] = None
    blood_type: Optional[str] = None
    height_cm: Optional[int] = None
    zodiac_sign: Optional[str] = None
    image_url: Optional[str] = None
    biography: Optional[str] = None
    social_media: Optional[dict] = None


class IdolResponse(IdolBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# === GroupMember ===
class GroupMemberBase(BaseModel):
    idol_id: int
    group_id: int
    generation_id: Optional[int] = None
    join_date: Optional[date] = None
    graduate_date: Optional[date] = None
    status: Optional[str] = "active"
    color: Optional[str] = None
    position: Optional[str] = None


class GroupMemberCreate(GroupMemberBase):
    pass


class GroupMemberResponse(GroupMemberBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# === Album ===
class AlbumBase(BaseModel):
    group_id: Optional[int] = None
    title: str
    title_zh: Optional[str] = None
    title_ja: Optional[str] = None
    title_ko: Optional[str] = None
    release_date: Optional[date] = None
    type: Optional[str] = None
    catalog_number: Optional[str] = None
    image_url: Optional[str] = None
    total_tracks: Optional[int] = None


class AlbumCreate(AlbumBase):
    pass


class AlbumResponse(AlbumBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# === Song ===
class SongBase(BaseModel):
    title: str
    title_zh: Optional[str] = None
    title_ja: Optional[str] = None
    title_ko: Optional[str] = None
    duration_seconds: Optional[int] = None
    lyrics: Optional[str] = None
    composers: Optional[str] = None
    lyricists: Optional[str] = None
    arrangers: Optional[str] = None
    is_title_track: bool = False


class SongCreate(SongBase):
    pass


class SongResponse(SongBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# === Concert ===
class ConcertBase(BaseModel):
    group_id: Optional[int] = None
    title: str
    title_zh: Optional[str] = None
    title_ja: Optional[str] = None
    venue: Optional[str] = None
    location: Optional[str] = None
    concert_date: date
    type: Optional[str] = None
    setlist: Optional[dict] = None
    image_url: Optional[str] = None
    description: Optional[str] = None


class ConcertCreate(ConcertBase):
    pass


class ConcertResponse(ConcertBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
