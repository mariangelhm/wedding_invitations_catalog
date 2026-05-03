# CountdownBlock

Componente reutilizable de cuenta regresiva para Vue 3 (Composition API).

## Props
- `targetDate: string` (requerido) — fecha objetivo en formato ISO.
- `title?: string` (opcional) — título mostrado sobre el contador.
- `variant?: "primary" | "minimal"` — variante visual.

## Uso
```vue
<CountdownBlock
  targetDate="2027-06-14T00:00:00"
  title="Faltan para nuestra boda"
  variant="primary"
/>
```

## Reutilización
- El cálculo de tiempo vive en `useCountdown.ts` para poder reutilizarse en otros bloques/páginas.
- El estilo vive en `countdownBlock.css` para mantener una separación clara entre lógica y presentación.
- La animación de entrada usa `IntersectionObserver` y se ejecuta solo una vez.
