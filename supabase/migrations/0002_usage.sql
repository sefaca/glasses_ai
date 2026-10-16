-- Contabilidad de generaciones.
--
-- Existe por una razón concreta y cara: cada generación cuesta ~0,10 € reales
-- y hasta ahora el único freno era un contador en memoria del proceso. En
-- serverless cada instancia lleva su propia cuenta, así que contra un script
-- no servía de nada.
--
-- Una fila por generación cobrable. Sin agregados ni contadores que mantener:
-- a este volumen contar filas es trivial y un contador desincronizado es un
-- fallo silencioso que se descubre leyendo la factura.

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),

  -- A quién se le imputa. 'anon' es una sesión anónima firmada; 'user', una
  -- cuenta. Se separan porque sus cupos son distintos y porque una sesión
  -- anónima se tira y se crea otra, mientras que una cuenta no.
  subject_type text not null check (subject_type in ('anon', 'user')),
  subject_id text not null,

  -- La montura, para saber qué se prueba. No es dato personal.
  frame_id text,

  -- Qué proveedor y cuánto costó, en céntimos. Es lo que permite comparar la
  -- estimación con la factura real al final del mes.
  provider text,
  cost_cents integer,

  created_at timestamptz not null default now()
);

-- Las dos consultas que se hacen en cada petición: cuántas lleva este sujeto,
-- y cuántas lleva el sitio hoy.
create index if not exists generations_subject_idx
  on public.generations (subject_type, subject_id);

create index if not exists generations_created_idx
  on public.generations (created_at desc);

-- Mismo criterio que la lista de espera: RLS activada y sin una sola
-- política. La clave anónima no puede leer ni escribir; el único acceso es
-- desde el servidor con la clave de servicio.
alter table public.generations enable row level security;

comment on table public.generations is
  'Una fila por generacion cobrable. Sostiene el cupo gratuito y el tope diario de gasto -> D-032.';
