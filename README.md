Package para automatizar a geracao de Services no AdonisJs v5.

## Instalacao

```bash
npm i @djpfs/adonisjs-service
```

## Para criar um novo Service

```bash
node ace make:service ServiceName
```
### Resultado

```bash
[ info ]  Generating service...
CREATE: app/Services/TesteService.ts
CREATE: contracts/interfaces/TesteService.ts
CREATE: providers/TesteServiceProvider.ts
ADD: ./providers/TesteServiceProvider to .adonisrc.json
```

## Para remover um Service

```bash
node ace remove:service ServiceName
```
### Resultado

```bash
[ info ]  Removing TesteService...
REMOVED: TesteService provider
REMOVED: TesteService service
REMOVED: TesteService interface
REMOVED: TesteService from .adonisrc.json providers
[ success ]  Done!
```
