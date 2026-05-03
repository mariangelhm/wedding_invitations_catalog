# TimelineBlock

Componente reutilizable para mostrar una bitácora/itinerario de evento.

## Props
- `title?: string` (default: `Bitácora del evento`)
- `items: Array<{ time: string; title: string; place: string }>`

## Uso
```vue
<TimelineBlock
  title="Bitácora del evento"
  :items="[
    { time: '17:00', title: 'Ceremonia', place: 'Jardín principal' },
    { time: '19:00', title: 'Cena', place: 'Salón principal' },
    { time: '21:00', title: 'Fiesta', place: 'Pista de baile' }
  ]"
/>
```

## Reutilización
- Diseñado para integrarse en futuros templates y flujos drag & drop.
- Usa IntersectionObserver para animar entrada una sola vez y mantener buen rendimiento.
