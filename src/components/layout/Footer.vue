<!-- Global footer shared across all pages. -->
<template>
  <footer class="app-footer">
    <div class="footer-grid">
      <section>
        <h3>Legal</h3>
        <a href="#">Legal</a>
        <a href="#">Privacidad</a>
        <a href="#">Términos</a>
        <a href="#">Configurar cookie</a>
      </section>

      <section>
        <h3>Contacto</h3>
        <a href="mailto:contacto@invitalo.cl">contacto@invitalo.cl</a>
        <a href="#">Soporte</a>
      </section>

      <section>
        <p>La plataforma completa para organizar eventos memorables</p>
        <a href="#">¿Necesitas ayuda? Escríbenos por WhatsApp</a>
        <a href="#">Síguenos en Instagram</a>
        <a href="#">Síguenos en Facebook</a>
      </section>
    </div>

    <p class="footer-copy">© 2026 InvitaLove. Todos los derechos reservados.</p>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #111111;
  color: white;
  padding: 40px 20px;
  margin-top: 40px;
}
.footer-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
section { display: grid; gap: 10px; }
section h3 { margin-bottom: 4px; }
section a { color: #d1d5db; text-decoration: none; }
section a:hover { color: #ffffff; }
.footer-copy {
  max-width: 1200px;
  margin: 28px auto 0;
  color: #d1d5db;
  font-size: 0.9rem;
}
@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr; gap: 18px; }
  .app-footer { text-align: center; }
}
</style>
