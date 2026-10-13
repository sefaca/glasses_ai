-- Lista de espera de la alfa privada.
--
-- Es la única tabla con un dato personal del producto, así que lleva más
-- comentario del habitual: dentro de seis meses alguien tiene que poder
-- justificar por qué cada columna existe.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),

  -- Normalizado en minúsculas por la aplicación antes de llegar aquí. La
  -- restricción única evita que la misma persona genere dos filas y, con
  -- ella, dos avisos.
  email text not null unique,

  -- En qué idioma se apuntó. Es lo que decide en qué idioma se le escribe:
  -- avisar en español a quien llegó por la versión alemana sería absurdo.
  locale text not null default 'es',

  -- Desde dónde. 'access_gate' es quien pulsó generar y se topó con el
  -- código; es la señal de intención más fuerte que tenemos.
  source text not null default 'content',

  -- Cuándo aceptó. Separado de created_at a propósito: es la prueba del acto
  -- afirmativo y hay que poder enseñarla si alguien la reclama.
  consent_at timestamptz not null default now(),

  created_at timestamptz not null default now(),

  -- Baja. No se borra la fila al darse de baja: se marca, para no volver a
  -- escribir a quien pidió que no. Una fila borrada se puede volver a crear
  -- sin que nadie note que ya había dicho que no.
  unsubscribed_at timestamptz
);

-- Para consultar por origen sin recorrer la tabla entera.
create index if not exists waitlist_source_idx on public.waitlist (source);

-- RLS activada y **sin una sola política**: con esto, la clave anónima no
-- puede leer ni escribir nada. El único acceso es desde el servidor con la
-- clave de servicio, que es la que salta RLS.
--
-- Si algún día alguien añade una política de lectura «para depurar», está
-- abriendo la lista de correos a cualquiera con la clave pública.
alter table public.waitlist enable row level security;

comment on table public.waitlist is
  'Lista de espera de la alfa. Dato personal: minimizar columnas y revisar retención antes de produccion -> CLAUDE.md 14.';
