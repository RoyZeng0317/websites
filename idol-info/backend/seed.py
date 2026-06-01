"""種子資料 - 填入範例偶像資訊"""
import asyncio
from datetime import date
from sqlalchemy import select
from database import async_session
from models import IdolGroup, Idol, GroupMember, Album, Song, AlbumSong, Concert


async def seed():
    from database import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        existing = await session.execute(select(IdolGroup))
        if existing.scalars().first():
            print("資料庫已有資料，跳過種子匯入")
            return

        # ===================== 偶像團體 =====================
        n46 = IdolGroup(
            name="Nogizaka46", name_zh="乃木坂46", name_ja="乃木坂46",
            debut_date=date(2012, 2, 22), agency="乃木坂46合同会社", label="N46Div.",
            country="JP", biography="日本大型女子偶像團體，為坂道系列之首。",
        )
        twice = IdolGroup(
            name="TWICE", name_zh="TWICE", name_ko="트와이스",
            debut_date=date(2015, 10, 20), agency="JYP Entertainment", label="Republic Records",
            country="KR", biography="韓國JYP娛樂旗下的九人女子團體，透過生存實境節目《SIXTEEN》成立。",
        )
        bp = IdolGroup(
            name="BLACKPINK", name_zh="BLACKPINK", name_ko="블랙핑크",
            debut_date=date(2016, 8, 8), agency="YG Entertainment", label="YG Entertainment",
            country="KR", biography="韓國YG娛樂旗下的四人女子團體，全球知名K-pop女團。",
        )

        session.add_all([n46, twice, bp])
        await session.flush()

        # ===================== 偶像成員 =====================

        # --- 乃木坂46 成員 ---
        iku = Idol(
            stage_name="Ikuho", stage_name_zh="一ノ瀬美空", stage_name_ja="一ノ瀬美空",
            real_name="一ノ瀬美空", nickname="いくほ",
            birth_date=date(2003, 5, 13), birthplace="東京都", blood_type="A", height_cm=158,
        )
        minami = Idol(
            stage_name="Minami", stage_name_zh="山下美月", stage_name_ja="山下美月",
            real_name="山下美月", nickname="みなみ",
            birth_date=date(1999, 7, 26), birthplace="東京都", blood_type="A", height_cm=160,
        )
        asuka = Idol(
            stage_name="Asuka", stage_name_zh="齋藤飛鳥", stage_name_ja="齋藤飛鳥",
            real_name="齋藤飛鳥", nickname="あすか",
            birth_date=date(1998, 8, 10), birthplace="東京都", blood_type="A", height_cm=158,
        )
        miona = Idol(
            stage_name="Miona", stage_name_zh="堀未央奈", stage_name_ja="堀未央奈",
            real_name="堀未央奈", nickname="みおな",
            birth_date=date(1996, 10, 15), birthplace="岐阜県", blood_type="O", height_cm=162,
        )
        # --- TWICE 成員 ---
        nayeon = Idol(
            stage_name="Nayeon", stage_name_zh="娜璉", stage_name_ko="나연",
            real_name="Im Na-yeon", nickname="ナヨン",
            birth_date=date(1995, 9, 22), birthplace="首爾特別市", blood_type="A", height_cm=163,
        )
        jeongyeon = Idol(
            stage_name="Jeongyeon", stage_name_zh="定延", stage_name_ko="정연",
            real_name="Yoo Jeong-yeon", nickname="ジョンヨン",
            birth_date=date(1996, 11, 1), birthplace="水原市", blood_type="O", height_cm=169,
        )
        momo = Idol(
            stage_name="Momo", stage_name_zh="Momo", stage_name_ko="모모", stage_name_ja="モモ",
            real_name="Hirai Momo", nickname="モモ",
            birth_date=date(1996, 11, 9), birthplace="京都府", blood_type="A", height_cm=159,
        )
        sana = Idol(
            stage_name="Sana", stage_name_zh="Sana", stage_name_ko="사나", stage_name_ja="サナ",
            real_name="Minatozaki Sana", nickname="サナ",
            birth_date=date(1996, 12, 29), birthplace="大阪府", blood_type="B", height_cm=166,
        )
        jihyo = Idol(
            stage_name="Jihyo", stage_name_zh="志效", stage_name_ko="지효",
            real_name="Park Ji-hyo", nickname="ジヒョ",
            birth_date=date(1997, 2, 1), birthplace="京畿道", blood_type="B", height_cm=160,
        )
        mina = Idol(
            stage_name="Mina", stage_name_zh="Mina", stage_name_ko="미나", stage_name_ja="ミナ",
            real_name="Myoui Mina", nickname="ミナ",
            birth_date=date(1997, 3, 24), birthplace="兵庫県", blood_type="A", height_cm=163,
        )
        dahyun = Idol(
            stage_name="Dahyun", stage_name_zh="多賢", stage_name_ko="다현",
            real_name="Kim Da-hyun", nickname="タヒョン",
            birth_date=date(1998, 5, 28), birthplace="城南市", blood_type="O", height_cm=165,
        )
        chaeyoung = Idol(
            stage_name="Chaeyoung", stage_name_zh="彩瑛", stage_name_ko="채영",
            real_name="Son Chae-young", nickname="チェヨン",
            birth_date=date(1999, 4, 23), birthplace="首爾特別市", blood_type="A", height_cm=159,
        )
        tzuyu = Idol(
            stage_name="Tzuyu", stage_name_zh="子瑜", stage_name_ko="쯔위",
            real_name="Chou Tzuyu", nickname="ツウィ",
            birth_date=date(1999, 6, 14), birthplace="台南市", blood_type="A", height_cm=172,
        )

        # --- BLACKPINK 成員 ---
        jisoo = Idol(
            stage_name="Jisoo", stage_name_zh="Jisoo", stage_name_ko="지수",
            real_name="Kim Ji-soo", nickname="ジス",
            birth_date=date(1995, 1, 3), birthplace="首爾特別市", blood_type="A", height_cm=162,
        )
        jennie = Idol(
            stage_name="Jennie", stage_name_zh="Jennie", stage_name_ko="제니",
            real_name="Kim Jennie", nickname="ジェニー",
            birth_date=date(1996, 1, 16), birthplace="首爾特別市", blood_type="A", height_cm=163,
        )
        rose = Idol(
            stage_name="Rosé", stage_name_zh="Rosé", stage_name_ko="로제",
            real_name="Roseanne Park", nickname="ロゼ",
            birth_date=date(1997, 2, 11), birthplace="奧克蘭 (紐西蘭)", blood_type="A", height_cm=168,
        )
        lisa = Idol(
            stage_name="Lisa", stage_name_zh="Lisa", stage_name_ko="리사",
            real_name="Pranpriya Manobal", nickname="リーサ",
            birth_date=date(1997, 3, 27), birthplace="曼谷", blood_type="O", height_cm=166,
        )

        all_idols = [iku, minami, asuka, miona,
                     nayeon, jeongyeon, momo, sana, jihyo, mina, dahyun, chaeyoung, tzuyu,
                     jisoo, jennie, rose, lisa]
        session.add_all(all_idols)
        await session.flush()

        # ===================== 團體成員關聯 =====================
        # 乃木坂46
        session.add_all([
            GroupMember(idol_id=iku.id, group_id=n46.id, join_date=date(2022, 2, 23), status="active"),
            GroupMember(idol_id=minami.id, group_id=n46.id, join_date=date(2016, 9, 4), graduate_date=date(2024, 5, 12), status="graduated"),
            GroupMember(idol_id=asuka.id, group_id=n46.id, join_date=date(2011, 8, 21), graduate_date=date(2023, 5, 11), status="graduated"),
            GroupMember(idol_id=miona.id, group_id=n46.id, join_date=date(2013, 3, 28), graduate_date=date(2020, 11, 27), status="graduated"),
        ])

        # TWICE
        twice_members = [
            (nayeon, "2015-10-20"), (jeongyeon, "2015-10-20"), (momo, "2015-10-20"),
            (sana, "2015-10-20"), (jihyo, "2015-10-20"), (mina, "2015-10-20"),
            (dahyun, "2015-10-20"), (chaeyoung, "2015-10-20"), (tzuyu, "2015-10-20"),
        ]
        for idol, join in twice_members:
            session.add(GroupMember(idol_id=idol.id, group_id=twice.id, join_date=date.fromisoformat(join), status="active"))

        # BLACKPINK
        bp_members = [(jisoo, "2016-08-08"), (jennie, "2016-08-08"), (rose, "2016-08-08"), (lisa, "2016-08-08")]
        for idol, join in bp_members:
            session.add(GroupMember(idol_id=idol.id, group_id=bp.id, join_date=date.fromisoformat(join), status="active"))

        # ===================== 專輯 =====================
        # 乃木坂46
        album1 = Album(group_id=n46.id, title="透明な色", title_zh="透明的顏色", title_ja="透明な色",
                       release_date=date(2024, 12, 18), type="album", total_tracks=12)

        # TWICE
        album2 = Album(group_id=twice.id, title="Formula of Love: O+T=<3",
                       release_date=date(2021, 11, 12), type="album", total_tracks=16)
        album3 = Album(group_id=twice.id, title="READY TO BE",
                       release_date=date(2023, 3, 10), type="ep", total_tracks=7)

        # BLACKPINK
        album4 = Album(group_id=bp.id, title="THE ALBUM",
                       release_date=date(2020, 10, 2), type="album", total_tracks=8)
        album5 = Album(group_id=bp.id, title="BORN PINK",
                       release_date=date(2022, 9, 16), type="album", total_tracks=8)

        session.add_all([album1, album2, album3, album4, album5])
        await session.flush()

        # ===================== 歌曲 =====================
        songs_data = [
            # 乃木坂46 - 透明な色
            Song(title="実際のところ", title_ja="実際のところ", is_title_track=True),
            Song(title="悪い成分", title_ja="悪い成分"),
            # TWICE - Formula of Love
            Song(title="SCIENTIST", title_ko="SCIENTIST", is_title_track=True),
            Song(title="MOONLIGHT", title_ko="MOONLIGHT"),
            Song(title="ICON", title_ko="ICON"),
            # TWICE - READY TO BE
            Song(title="SET ME FREE", title_ko="SET ME FREE", is_title_track=True),
            Song(title="MOONLIGHT SUNRISE", title_ko="MOONLIGHT SUNRISE"),
            # BLACKPINK - THE ALBUM
            Song(title="How You Like That", is_title_track=True),
            Song(title="Ice Cream", is_title_track=True),
            Song(title="Lovesick Girls"),
            # BLACKPINK - BORN PINK
            Song(title="Pink Venom", is_title_track=True),
            Song(title="Shut Down", is_title_track=True),
            Song(title="Typa Girl"),
        ]
        session.add_all(songs_data)
        await session.flush()

        # 關聯歌曲到專輯
        session.add_all([
            AlbumSong(album_id=album1.id, song_id=songs_data[0].id, track_number=1),
            AlbumSong(album_id=album1.id, song_id=songs_data[1].id, track_number=2),
            AlbumSong(album_id=album2.id, song_id=songs_data[2].id, track_number=1),
            AlbumSong(album_id=album2.id, song_id=songs_data[3].id, track_number=2),
            AlbumSong(album_id=album2.id, song_id=songs_data[4].id, track_number=3),
            AlbumSong(album_id=album3.id, song_id=songs_data[5].id, track_number=1),
            AlbumSong(album_id=album3.id, song_id=songs_data[6].id, track_number=2),
            AlbumSong(album_id=album4.id, song_id=songs_data[7].id, track_number=1),
            AlbumSong(album_id=album4.id, song_id=songs_data[8].id, track_number=2),
            AlbumSong(album_id=album4.id, song_id=songs_data[9].id, track_number=3),
            AlbumSong(album_id=album5.id, song_id=songs_data[10].id, track_number=1),
            AlbumSong(album_id=album5.id, song_id=songs_data[11].id, track_number=2),
            AlbumSong(album_id=album5.id, song_id=songs_data[12].id, track_number=3),
        ])

        await session.commit()
        print("種子資料已成功匯入！")


if __name__ == "__main__":
    asyncio.run(seed())
