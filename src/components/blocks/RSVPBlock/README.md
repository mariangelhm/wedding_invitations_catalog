# RSVPBlock

Bloque reutilizable para confirmar asistencia en invitaciones digitales.

## Props
- `title?: string` (default: `¿Nos acompañas?`)
- `buttonLabel?: string` (default: `Confirmar asistencia`)

## Evento emitido
`confirm` con payload:
```ts
{
  fullName: string,
  response: "confirmed"
}
```

## Uso
```vue
<RSVPBlock
  title="¿Nos acompañas?"
  buttonLabel="Confirmar asistencia"
  @confirm="handleConfirm"
/>
```

```ts
function handleConfirm(payload) {
  console.log(payload)
}
```

## Nota
Actualmente el bloque solo valida y emite el evento. La conexión con backend se agregará en una fase posterior.
