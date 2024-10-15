CREATE TABLE kv (
    key TEXT NOT NULL UNIQUE, -- Define key as a unique text field
    value JSON -- Define value as a JSON field
);

-- Create an index on the key field
CREATE INDEX idx_key ON kv(key);
