<template>
  <header class="app-header">
    <div class="container">
      <span class="title">City Builder</span>
      <span class="version">v1.0.0</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  background: #007bff;
  color: white;
  padding: 15px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 1.2rem;
  font-weight: bold;
}

.version {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
