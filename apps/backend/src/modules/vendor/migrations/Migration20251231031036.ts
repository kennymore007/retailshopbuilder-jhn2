import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251231031036 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "booking" drop constraint if exists "booking_booking_code_unique";`);
    this.addSql(`alter table if exists "vendor" drop constraint if exists "vendor_vendor_code_unique";`);
    this.addSql(`create table if not exists "vendor" ("id" text not null, "vendor_code" text not null, "business_name" text not null, "vendor_type" text check ("vendor_type" in ('farmer', 'gig_worker', 'storage_operator', 'equipment_owner', 'logistics_provider')) not null, "contact_person" text not null, "phone" text not null, "email" text not null, "location" jsonb null, "is_verified" boolean not null default false, "verification_date" timestamptz null, "registration_number" text null, "tax_id" text null, "bank_account" jsonb null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vendor_vendor_code_unique" ON "vendor" ("vendor_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_deleted_at" ON "vendor" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "listing" ("id" text not null, "marketplace_type" text check ("marketplace_type" in ('harvest', 'vehicle', 'storage', 'equipment')) not null, "title" text not null, "description" text null, "vendor_id" text not null, "price_type" text check ("price_type" in ('fixed', 'hourly', 'daily', 'weekly', 'monthly')) not null default 'fixed', "base_price" numeric not null, "currency_code" text not null default 'usd', "is_available" boolean not null default true, "availability_status" text check ("availability_status" in ('available', 'reserved', 'rented', 'sold', 'maintenance', 'inactive')) not null default 'available', "quantity" integer null, "unit" text null, "location" jsonb null, "harvest_data" jsonb null, "vehicle_data" jsonb null, "storage_data" jsonb null, "equipment_data" jsonb null, "images" text[] null, "traceability_data" jsonb null, "status" text check ("status" in ('draft', 'published', 'pending_verification', 'archived')) not null default 'draft', "published_at" timestamptz null, "metadata" jsonb null, "raw_base_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "listing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_listing_vendor_id" ON "listing" ("vendor_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_listing_deleted_at" ON "listing" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "booking" ("id" text not null, "booking_code" text not null, "listing_id" text not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "duration_hours" integer null, "total_amount" numeric not null, "currency_code" text not null default 'usd', "deposit_amount" numeric null, "deposit_status" text check ("deposit_status" in ('pending', 'held', 'released', 'forfeited')) null, "booking_status" text check ("booking_status" in ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed')) not null default 'pending', "confirmed_at" timestamptz null, "confirmed_by" text null, "pickup_location" jsonb null, "delivery_location" jsonb null, "pickup_time" timestamptz null, "delivery_time" timestamptz null, "pickup_proof" jsonb null, "delivery_proof" jsonb null, "cancelled_at" timestamptz null, "cancellation_reason" text null, "customer_notes" text null, "vendor_notes" text null, "metadata" jsonb null, "raw_total_amount" jsonb not null, "raw_deposit_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "booking_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_booking_booking_code_unique" ON "booking" ("booking_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_listing_id" ON "booking" ("listing_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_deleted_at" ON "booking" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "listing" add constraint "listing_vendor_id_foreign" foreign key ("vendor_id") references "vendor" ("id") on update cascade;`);

    this.addSql(`alter table if exists "booking" add constraint "booking_listing_id_foreign" foreign key ("listing_id") references "listing" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "listing" drop constraint if exists "listing_vendor_id_foreign";`);

    this.addSql(`alter table if exists "booking" drop constraint if exists "booking_listing_id_foreign";`);

    this.addSql(`drop table if exists "vendor" cascade;`);

    this.addSql(`drop table if exists "listing" cascade;`);

    this.addSql(`drop table if exists "booking" cascade;`);
  }

}
