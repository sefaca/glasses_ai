-- Generaciones compradas.
--
-- Una fila por compra, nunca un saldo. El saldo se calcula: compradas más
-- gratuitas, menos usadas.
--
-- Un contador de saldo sería más rápido de leer y es exactamente lo que no
-- queremos: si una actualización se pierde o se aplica dos veces, alguien
-- acaba con generaciones que no pagó o sin las que pagó, y no hay forma de
-- saber cuál de las dos cosas pasó. Con una fila por compra, el historial
-- **es** la verdad y siempre se puede reconstruir.

create table if not exists public.credits (
  id uuid primary key default gen_random_uuid(),

  -- Siempre una cuenta: no se venden créditos a sesiones anónimas, porque
  -- quien paga tiene que poder recuperar lo suyo al volver.
  user_id text not null,

  -- Cuántas generaciones da esta compra.
  generations integer not null check (generations > 0),

  -- El identificador de la transacción en Paddle.
  --
  -- **Único, y esa es la pieza clave**: Paddle reenvía los avisos cuando no
  -- recibe un 200, así que el mismo pago puede llegar varias veces. Sin esta
  -- restricción, un reintento regalaría un pack. Con ella, el segundo intento
  -- choca y no hace nada.
  transaction_id text not null unique,

  price_id text,
  -- En céntimos de la divisa cobrada, para cuadrar con la liquidación.
  amount_cents integer,
  currency text,

  created_at timestamptz not null default now()
);

create index if not exists credits_user_idx on public.credits (user_id);

-- Mismo criterio que el resto: sin políticas, solo servidor.
alter table public.credits enable row level security;

comment on table public.credits is
  'Una fila por compra. El saldo se calcula, no se guarda -> D-034.';
