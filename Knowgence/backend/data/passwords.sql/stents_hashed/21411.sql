-- 自動產生，含 bcrypt hash。執行前請確認資料庫已存在。
USE knowgence;

CREATE TABLE IF NOT EXISTS students (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    students_name VARCHAR(100),
    account       VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    class_name    VARCHAR(100)
);

INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414101@nfu.edu.tw', '', '$2b$12$1HvK/cfQXtIodcJ.9Vflvu1EIzZ8SGc8twtrVni8IFxXb.wqhGFVC');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414102@nfu.edu.tw', '', '$2b$12$QzxoRsGgnZP6gP2Qq.Ghee7k.8WSQNgk/FXQki2ZR/90ksy0P0NJm');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414103@nfu.edu.tw', '', '$2b$12$j1hnZXUkhKu.WtXdPkdevOq9YJtaxhRNxaZ.IUvdwD4YkhUKIkQjO');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414104@nfu.edu.tw', '', '$2b$12$1oza8qqlPFHZu1MIcmV2TuADuuGrS6wfg1REBKcaPY3bBaXHF1ooW');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414105@nfu.edu.tw', '', '$2b$12$xXOElvuZRoMVQF1EXxmaZurMEyDrBRarW.cLAs05POJj3K5sG1Fgi');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414106@nfu.edu.tw', '', '$2b$12$Z39tTmxTVdJB.sJH.Fx9YeaHiEdVM509hfrm64i/OF5DQekyYdqKu');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414107@nfu.edu.tw', '', '$2b$12$nlpUnjKZ1aCteiCFwrcl8OampXxylYDFGnhyjbrOaJa2SFUNyDQQO');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414108@nfu.edu.tw', '', '$2b$12$OJk5XyIXrL3N9jyZxUEOeO5Yj2ZFQ43FVtcts5fyMs.07QLIT2VG2');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414109@nfu.edu.tw', '', '$2b$12$tDd5Ib4af010wjhclqgpWuqn.4NuR7Ak1zSx8IdLhQcZt4Gg4rqbS');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414110@nfu.edu.tw', '', '$2b$12$qmtSS/6KG73lURpewLK88.amXhU4TEoLG.NFG3o9/Tb1DSBnNxYsm');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414111@nfu.edu.tw', '邱致綸', '$2b$12$7LryJ9kQzCHaB1kE9nJvOedEC12mnBt0ni8YNyQQZZhGkvB0T44uy');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414112@nfu.edu.tw', '', '$2b$12$AsVvhMsNajUvlzugnFD1OeeUs94RAwFh5CRT/7wIdP1xzpG9/lJM6');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414113@nfu.edu.tw', '', '$2b$12$0fgLF0pk/Obant0HaNmTHetsb0.PH52CYDQm09Owx3zdOgYAHsx6y');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414114@nfu.edu.tw', '', '$2b$12$jTvPjTyfHOrs215yZZBCyOaXJ5eygsWCFlC2hxq//ihscrMiIbW7W');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414115@nfu.edu.tw', '', '$2b$12$TNNXf/LNW.BZCJPoUXQTEeSFrHAiA6yqC27TABCxQ7GGlX36yMWdW');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414116@nfu.edu.tw', '', '$2b$12$SWgzBknxo8zsSRrg6F.Ql.m/Y8FevKKpRSAWbwPCfjqQeKGIHBgy6');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414117@nfu.edu.tw', '', '$2b$12$hEH8roVwxaOpkxC5W.pwH.qjESUPjPwcJPCdYEtmN1jFk5x.cZJJu');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414118@nfu.edu.tw', '', '$2b$12$9dlU1vHC7qlTVdT04bCOve48RqRTNZ419Yuyn6UsGgRV5dIGSocSS');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414119@nfu.edu.tw', '', '$2b$12$BlQAE3LsU8UXY.p5nzGWpO1eHOdEdADcp55bWotgRSFtdPgEaRjnS');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414120@nfu.edu.tw', '', '$2b$12$8EYOlU0Hc24i8zBGhf77tuVpHxoYb79m8eVN2H0dOEHPWEeoCII7a');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414121@nfu.edu.tw', '', '$2b$12$sUD8uv9djo9lS3o9AWzvDeNG.rsgd87ZRVDMo4bhDmg2d0mOL6cki');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414122@nfu.edu.tw', '', '$2b$12$VSZJNgSKB/FFVmEE9t..suaCu7P9/xYWWqzLk7qHRN7tvt51BNiDe');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414123@nfu.edu.tw', '', '$2b$12$AkXPOEXyzjtHnlsEc53IkeK/lyI7hxB./k3WHS5oY/6SBJ9mQeBra');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414124@nfu.edu.tw', '', '$2b$12$.dDKuwkUWR8./o8p9FEQvOP9T95Dp17vE5ZMlhFv8NUJDqGo7d4Oy');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414125@nfu.edu.tw', '', '$2b$12$oNMdauDFh098w3xhXoUv/efw3bc2EGeY0uBRwPehCnQibw.HZjtz.');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414126@nfu.edu.tw', '', '$2b$12$8InIm4n.HQoC.47Fqf/NSusxbe0X8X6hmmp/deZSK.6hw6Vraxg7K');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414127@nfu.edu.tw', '', '$2b$12$ka.5.8LGwCevxXHpqiOFWe11Cb4g6Z5M1RjoykyWzo2EFokpBYjOW');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414128@nfu.edu.tw', '', '$2b$12$ChkpOG.n4zXbn5.BODsIYesWeQZt9gEkmQtvwDtpjsGByb.K4tQz2');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414129@nfu.edu.tw', '', '$2b$12$kFncjpyUEqExrLU9HePTE.PzOrfTot.YiOpEgPmtDiK94JnzVuHEe');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414131@nfu.edu.tw', '', '$2b$12$hsb908q3yc4.FVhopwEtuOj.sonb8cP0W9hS4BWO6N7t.6zFlmQrW');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414132@nfu.edu.tw', '', '$2b$12$XHG7DKnrB4Y9v8q8g2R/MOeDnt1bG0GnB9wNmaQzw7oWIly1Gxle2');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414133@nfu.edu.tw', '', '$2b$12$kwDiOAljNVb/Imb4kgnSieVtul5ZPX0zvFS.P9zbqZLs/LIgtmrC2');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414134@nfu.edu.tw', '', '$2b$12$aqpvK70.jAgqYgXJGbnjQeUP8dUKztu9Pzy2DDGGyd0ww42cvsDXm');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414135@nfu.edu.tw', '', '$2b$12$vDDvqZlj.i5nt8ksWDelj.ASUAj6YccOgwiSKaLSkkEdfRxUcJ2u2');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414136@nfu.edu.tw', '', '$2b$12$Kg4O/8uHPzd1vyCp6NKBSOI1TSr/O4RAvYsNfDfa2lWeFNZx7sbhO');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414137@nfu.edu.tw', '', '$2b$12$Z8TZRMddS0lDDIyRI6oXXey4lAhDJ3cRqAxBAaM2GvA9.PXtahX9u');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414138@nfu.edu.tw', '', '$2b$12$rjJnxJ7zMFOFYK4pkgTfcuUI.Z3Ytv9r05wEhwzWIfITMKyc.6tLe');
INSERT IGNORE INTO students (class_name, account, students_name, password_hash) VALUES ('二子一甲', '21414139@nfu.edu.tw', '', '$2b$12$SgtDhYm4btEnmBEOtGb4A.au0TGt6oAT0hl3XFdGFHklclvSmGeqm');
