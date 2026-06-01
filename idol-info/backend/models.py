from datetime import date, datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Date, DateTime,
    ForeignKey, UniqueConstraint, JSON,
)
from sqlalchemy.orm import relationship

from database import Base


class IdolGroup(Base):
    __tablename__ = "idol_groups"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    name_zh = Column(String(255))
    name_ja = Column(String(255))
    name_ko = Column(String(255))
    debut_date = Column(Date)
    agency = Column(String(255))
    label = Column(String(255))
    country = Column(String(100), default="JP")
    status = Column(String(50), default="active")
    image_url = Column(Text)
    biography = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)

    generations = relationship("Generation", back_populates="group")
    members = relationship("GroupMember", back_populates="group")
    albums = relationship("Album", back_populates="group")
    concerts = relationship("Concert", back_populates="group")


class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(Integer, ForeignKey("idol_groups.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    name_zh = Column(String(255))
    name_ja = Column(String(255))
    debut_date = Column(Date)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.now)

    group = relationship("IdolGroup", back_populates="generations")
    members = relationship("GroupMember", back_populates="generation")


class Idol(Base):
    __tablename__ = "idols"

    id = Column(Integer, primary_key=True, autoincrement=True)
    stage_name = Column(String(255), nullable=False)
    stage_name_zh = Column(String(255))
    stage_name_ja = Column(String(255))
    stage_name_ko = Column(String(255))
    real_name = Column(String(255))
    nickname = Column(String(255))
    birth_date = Column(Date)
    birthplace = Column(String(255))
    blood_type = Column(String(5))
    height_cm = Column(Integer)
    zodiac_sign = Column(String(50))
    image_url = Column(Text)
    biography = Column(Text)
    social_media = Column(JSON)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)

    group_memberships = relationship("GroupMember", back_populates="idol")


class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    idol_id = Column(Integer, ForeignKey("idols.id", ondelete="CASCADE"), nullable=False)
    group_id = Column(Integer, ForeignKey("idol_groups.id", ondelete="CASCADE"), nullable=False)
    generation_id = Column(Integer, ForeignKey("generations.id", ondelete="SET NULL"))
    join_date = Column(Date)
    graduate_date = Column(Date)
    status = Column(String(50), default="active")
    color = Column(String(50))
    position = Column(String(255))
    created_at = Column(DateTime(timezone=True), default=datetime.now)

    __table_args__ = (UniqueConstraint("idol_id", "group_id"),)

    idol = relationship("Idol", back_populates="group_memberships")
    group = relationship("IdolGroup", back_populates="members")
    generation = relationship("Generation", back_populates="members")


class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(Integer, ForeignKey("idol_groups.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    title_zh = Column(String(255))
    title_ja = Column(String(255))
    title_ko = Column(String(255))
    release_date = Column(Date)
    type = Column(String(50))
    catalog_number = Column(String(100))
    image_url = Column(Text)
    total_tracks = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)

    group = relationship("IdolGroup", back_populates="albums")
    songs = relationship("AlbumSong", back_populates="album")


class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    title_zh = Column(String(255))
    title_ja = Column(String(255))
    title_ko = Column(String(255))
    duration_seconds = Column(Integer)
    lyrics = Column(Text)
    composers = Column(Text)
    lyricists = Column(Text)
    arrangers = Column(Text)
    is_title_track = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)

    albums = relationship("AlbumSong", back_populates="song")


class AlbumSong(Base):
    __tablename__ = "album_songs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    album_id = Column(Integer, ForeignKey("albums.id", ondelete="CASCADE"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id", ondelete="CASCADE"), nullable=False)
    track_number = Column(Integer)
    disc_number = Column(Integer, default=1)
    participants = Column(Text)

    __table_args__ = (UniqueConstraint("album_id", "song_id"),)

    album = relationship("Album", back_populates="songs")
    song = relationship("Song", back_populates="albums")


class Concert(Base):
    __tablename__ = "concerts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(Integer, ForeignKey("idol_groups.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    title_zh = Column(String(255))
    title_ja = Column(String(255))
    venue = Column(String(255))
    location = Column(String(255))
    concert_date = Column(Date, nullable=False)
    type = Column(String(50))
    setlist = Column(JSON)
    image_url = Column(Text)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)

    group = relationship("IdolGroup", back_populates="concerts")


class Award(Base):
    __tablename__ = "awards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    name_zh = Column(String(255))
    category = Column(String(255))
    year = Column(Integer)
    winner_type = Column(String(50))
    winner_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
