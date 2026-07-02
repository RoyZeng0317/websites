-- Vaultix ID table
-- Each user can claim one unique Vaultix ID (like a @handle)
-- Apply on Pi: mysql -u nas_user -p casaos_nas < VaultixID.sql

CREATE TABLE IF NOT EXISTS vaultix_ids (
  user_id         INT          NOT NULL PRIMARY KEY,
  vaultix_id      VARCHAR(30)  NOT NULL,
  vaultix_id_hash VARCHAR(64)  DEFAULT NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_vaultix_id UNIQUE (vaultix_id),
  CONSTRAINT fk_vaultix_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
