/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly MANGOS_DBHOST?: string;
  readonly MANGOS_DBPORT?: string;
  readonly MANGOS_DBUSER?: string;
  readonly MANGOS_DBPASS?: string;
  readonly MANGOS_WORLD_DBNAME?: string;
  readonly MANGOS_CHARACTERS_DBNAME?: string;
  readonly MANGOS_REALMD_DBNAME?: string;
  readonly PUBLIC_REALMLIST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
