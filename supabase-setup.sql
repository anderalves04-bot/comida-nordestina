-- ========================================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS - TRADIÇÃO CHURRASCARIA (SUPABASE)
-- Execute este script no SQL Editor do seu projeto Supabase para criar
-- todas as tabelas, ativar RLS, configurar políticas e criar o Storage bucket.
-- ========================================================================

-- 1. Tabela de Categorias
create table if not exists public.categorias (
    id text primary key,
    nome text not null,
    descricao text,
    criado_em timestamptz default now()
);

-- 2. Tabela de Produtos (Cardápio)
create table if not exists public.produtos (
    id text primary key,
    nome text not null,
    descricao text,
    preco numeric not null check (preco >= 0),
    imagem_url text,
    categoria_id text references public.categorias(id) on delete set null,
    destaque boolean default false,
    criado_em timestamptz default now()
);

-- 3. Tabela de Pedidos de Reserva (Agenda)
create table if not exists public.pedidos_reserva (
    id uuid default gen_random_uuid() primary key,
    code text not null unique,
    nome_cliente text not null,
    telefone text not null,
    quantidade_pessoas integer not null check (quantidade_pessoas > 0),
    data_reserva date not null,
    horario text not null,
    observacoes text,
    status text default 'pending' check (status in ('pending', 'confirmed')),
    criado_em timestamptz default now()
);

-- 4. Tabela de Avaliações (Depoimentos)
create table if not exists public.avaliacoes (
    id uuid default gen_random_uuid() primary key,
    nome_cliente text not null,
    comentario text not null,
    nota integer not null check (nota between 1 and 5),
    criado_em timestamptz default now()
);

-- 5. Habilitar Row Level Security (RLS) para todas as tabelas
alter table public.categorias enable row level security;
alter table public.produtos enable row level security;
alter table public.pedidos_reserva enable row level security;
alter table public.avaliacoes enable row level security;

-- 6. Políticas de Segurança para Categorias
create policy "Permitir leitura pública de categorias" 
on public.categorias for select to public using (true);

create policy "Permitir alteração de categorias para administradores autenticados" 
on public.categorias for all to authenticated using (true) with check (true);

-- 7. Políticas de Segurança para Produtos
create policy "Permitir leitura pública de produtos" 
on public.produtos for select to public using (true);

create policy "Permitir alteração de produtos para administradores autenticados" 
on public.produtos for all to authenticated using (true) with check (true);

-- 8. Políticas de Segurança para Pedidos de Reserva
create policy "Permitir inserção pública de reservas" 
on public.pedidos_reserva for insert to public with check (true);

create policy "Permitir leitura e controle de reservas apenas para administradores autenticados" 
on public.pedidos_reserva for all to authenticated using (true) with check (true);

-- 9. Políticas de Segurança para Avaliações
create policy "Permitir leitura pública de avaliações" 
on public.avaliacoes for select to public using (true);

create policy "Permitir inserção pública de avaliações" 
on public.avaliacoes for insert to public with check (true);

create policy "Permitir gerenciamento de avaliações apenas para administradores autenticados" 
on public.avaliacoes for all to authenticated using (true) with check (true);

-- 10. Inserção de categorias padrão inicial se estiver vazio
insert into public.categorias (id, nome, descricao) values
('principais', 'Carnes Nobres', 'Os melhores cortes grelhados na brasa para o seu rodízio'),
('porcoes', 'Buffet & Acompanhamentos', 'Saladas, acompanhamentos e petiscos para compartilhar'),
('sobremesas', 'Sobremesas', 'O doce fechamento perfeito depois do rodízio'),
('bebidas', 'Vinhos & Bebidas', 'Sucos, cervejas, vinhos e caipirinhas artesanais')
on conflict (id) do nothing;

-- 11. Criar o Bucket no Storage para imagens de produtos
insert into storage.buckets (id, name, public) 
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

-- 12. Políticas de segurança do Supabase Storage (Bucket 'produtos')
create policy "Permitir leitura pública das imagens de produtos"
on storage.objects for select to public
using (bucket_id = 'produtos');

create policy "Permitir upload de imagens para administradores autenticados"
on storage.objects for insert to authenticated
with check (bucket_id = 'produtos');

create policy "Permitir alteração de imagens para administradores autenticados"
on storage.objects for update to authenticated
using (bucket_id = 'produtos');

create policy "Permitir exclusão de imagens para administradores autenticados"
on storage.objects for delete to authenticated
using (bucket_id = 'produtos');
