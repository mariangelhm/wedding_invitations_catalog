# StoryBlock

Bloque reutilizable para mostrar la historia de los novios en invitaciones y templates.

## Props
- `title?: string` (default: `Nuestra historia`)
- `message: string`

## Uso
```vue
<StoryBlock
  title="Nuestra historia"
  message="Todo comenzó con una coincidencia y hoy queremos celebrarlo contigo."
/>
```

## Propósito
- Presenta contenido narrativo con estilo romántico, limpio y minimalista.
- Diseñado para reutilización futura en plantillas y flujos de drag & drop.
- Incluye animación de entrada con `IntersectionObserver` ejecutada una sola vez.
