import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251231032551 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_vendor_vendor_code_unique";`);
    this.addSql(`alter table if exists "vendor" drop column if exists "vendor_code", drop column if exists "vendor_type", drop column if exists "contact_person", drop column if exists "phone", drop column if exists "is_verified";`);

    this.addSql(`alter table if exists "vendor" add column if not exists "phone_number" text null, add column if not exists "actor_type" text check ("actor_type" in ('farmer', 'gig_worker', 'storage_operator', 'equipment_owner', 'logistics_provider', 'buyer', 'agent')) not null, add column if not exists "verification_status" text check ("verification_status" in ('pending', 'verified', 'rejected')) not null default 'pending';`);
    this.addSql(`alter table if exists "vendor" alter column "location" type text using ("location"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "vendor" drop column if exists "phone_number", drop column if exists "actor_type", drop column if exists "verification_status";`);

    this.addSql(`alter table if exists "vendor" add column if not exists "vendor_code" text not null, add column if not exists "vendor_type" text check ("vendor_type" in ('farmer', 'gig_worker', 'storage_operator', 'equipment_owner', 'logistics_provider')) not null, add column if not exists "contact_person" text not null, add column if not exists "phone" text not null, add column if not exists "is_verified" boolean not null default false;`);
    this.addSql(`alter table if exists "vendor" alter column "location" type jsonb using ("location"::jsonb);`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vendor_vendor_code_unique" ON "vendor" ("vendor_code") WHERE deleted_at IS NULL;`);
  }

}
