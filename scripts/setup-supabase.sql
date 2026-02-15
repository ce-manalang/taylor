-- Enable pgvector extension
-- (Also enable via Dashboard > Database > Extensions > search 'vector' > Enable)
create extension if not exists vector;

-- Lyrics table
create table lyrics (
  id bigserial primary key,
  lyric_text text not null,
  embedding vector(1536)
);

-- Similarity search function using inner product (fastest for normalized OpenAI embeddings)
-- Uses <#> operator (negative inner product) - optimal for normalized embeddings
-- Returns lyrics ranked by similarity (1 - negative inner product = similarity)
create or replace function match_lyrics (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  lyric_text text,
  similarity float
)
language sql
as $$
  select
    id,
    lyric_text,
    1 - (embedding <#> query_embedding) as similarity
  from lyrics
  where 1 - (embedding <#> query_embedding) > match_threshold
  order by embedding <#> query_embedding asc
  limit least(match_count, 200);
$$;
