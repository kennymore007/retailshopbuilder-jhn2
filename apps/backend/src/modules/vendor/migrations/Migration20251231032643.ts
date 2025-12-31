import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251231032643 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "listing" drop constraint if exists "listing_status_check";`);

    this.addSql(`alter table if exists "listing" drop column if exists "price_type", drop column if exists "base_price", drop column if exists "currency_code", drop column if exists "is_available", drop column if exists "availability_status", drop column if exists "harvest_data", drop column if exists "vehicle_data", drop column if exists "storage_data", drop column if exists "equipment_data", drop column if exists "images", drop column if exists "traceability_data", drop column if exists "published_at", drop column if exists "raw_base_price";`);

    this.addSql(`alter table if exists "listing" add column if not exists "price_amount" integer not null, add column if not exists "price_currency" text not null default 'kes';`);
    this.addSql(`alter table if exists "listing" alter column "location" type text using ("location"::text);`);
    this.addSql(`alter table if exists "listing" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table if exists "listing" alter column "status" set default 'active';`);
    this.addSql(`alter table if exists "listing" add constraint "listing_status_check" check("status" in ('active', 'inactive', 'sold', 'rented'));`);
    this.addSql(`alter table if exists "listing" rename column "marketplace_type" to "listing_type";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "listing" drop constraint if exists "listing_status_check";`);

    this.addSql(`alter table if exists "listing" drop column if exists "price_amount", drop column if exists "price_currency";`);

    this.addSql(`alter table if exists "listing" add column if not exists "price_type" text check ("price_type" in ('fixed', 'hourly', 'daily', 'weekly', 'monthly')) not null default 'fixed', add column if not exists "base_price" numeric not null, add column if not exists "currency_code" text not null default 'usd', add column if not exists "is_available" boolean not null default true, add column if not exists "availability_status" text check ("availability_status" in ('available', 'reserved', 'rented', 'sold', 'maintenance', 'inactive')) not null default 'available', add column if not exists "harvest_data" jsonb null, add column if not exists "vehicle_data" jsonb null, add column if not exists "storage_data" jsonb null, add column if not exists "equipment_data" jsonb null, add column if not exists "images" text[] null, add column if not exists "traceability_data" jsonb null, add column if not exists "published_at" timestamptz null, add column if not exists "raw_base_price" jsonb not null;`);
    this.addSql(`alter table if exists "listing" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table if exists "listing" alter column "status" set default 'draft';`);
    this.addSql(`alter table if exists "listing" alter column "location" type jsonb using ("location"::jsonb);`);
    this.addSql(`alter table if exists "listing" add constraint "listing_status_check" check("status" in ('draft', 'published', 'pending_verification', 'archived'));`);
    this.addSql(`alter table if exists "listing" rename column "listing_type" to "marketplace_type";`);
  }

}
