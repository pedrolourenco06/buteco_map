// src/App.jsx
// Coração da aplicação: estado central + composição dos componentes.
// Toda a lógica de filtro, bar ativo e rota vive aqui,
// descendo via props para os filhos.

import { useState, useMemo, useCallback } from 'react';
import { BARES, REGIOES } from './data/bares';
import { useFirebase }    from './hooks/useFirebase';

// Componentes (serão criados nas próximas partes)
import Header    from './components/Header';
import Sidebar   from './components/Sidebar';
import MapView   from './components/MapView';
import InfoPanel from './components/InfoPanel';
import RoutePanel from './components/RoutePanel';

export default function App() {
  // ── Estado de filtros ──────────────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeRegiao,   setActiveRegiao]   = useState('TODOS');
  const [sidebarOpen,    setSidebarOpen]    = useState(true);

  // ── Bar selecionado ────────────────────────────────────────────────────────
  const [activeBar,      setActiveBar]      = useState(null);  // objeto Bar | null

  // ── Rota ──────────────────────────────────────────────────────────────────
  const [routeOpen,      setRouteOpen]      = useState(false);
  const [travelMode,     setTravelMode]     = useState('DRIVING');
  const [userLocation,   setUserLocation]   = useState(null);  // { lat, lng } | null

  // ── Firebase ───────────────────────────────────────────────────────────────
  const { user, visitedMap, loading: authLoading, login, logout, toggleVisited } = useFirebase();

  // ── Lista filtrada (derivada, sem useState extra) ──────────────────────────
  const filteredBares = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BARES.filter((b) => {
      const matchRegiao = activeRegiao === 'TODOS' || b.regiao === activeRegiao;
      const matchSearch =
        !q ||
        b.nome.toLowerCase().includes(q)   ||
        b.prato.toLowerCase().includes(q)  ||
        b.desc.toLowerCase().includes(q)   ||
        b.bairro.toLowerCase().includes(q);
      return matchRegiao && matchSearch;
    });
  }, [searchQuery, activeRegiao]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectBar = useCallback((bar) => {
    setActiveBar(bar);
    setRouteOpen(false);
  }, []);

  const handleCloseInfoPanel = useCallback(() => {
    setActiveBar(null);
  }, []);

  const handleOpenRoute = useCallback(() => {
    setRouteOpen(true);
  }, []);

  const handleCloseRoute = useCallback(() => {
    setRouteOpen(false);
  }, []);

  const handleToggleVisited = useCallback(async () => {
    if (!activeBar) return;
    if (!user) {
      alert('Entre com Google para salvar seu checklist.');
      return;
    }
    await toggleVisited(activeBar.id);
  }, [activeBar, user, toggleVisited]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Cabeçalho ── */}
      <Header
        totalVisible={filteredBares.length}
        user={user}
        authLoading={authLoading}
        onLogin={login}
        onLogout={logout}
      />

      {/* ── Sidebar com lista + filtros ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        bares={filteredBares}
        regioes={REGIOES}
        activeRegiao={activeRegiao}
        searchQuery={searchQuery}
        activeBarId={activeBar?.id ?? null}
        visitedMap={visitedMap}
        onSelectBar={handleSelectBar}
        onSearchChange={setSearchQuery}
        onRegiaoChange={setActiveRegiao}
      />

      {/* ── Mapa Google Maps ── */}
      <MapView
        sidebarOpen={sidebarOpen}
        bares={filteredBares}
        activeBar={activeBar}
        userLocation={userLocation}
        onSelectBar={handleSelectBar}
        onUserLocationFound={setUserLocation}
      />

      {/* ── Painel inferior de detalhes ── */}
      {activeBar && (
        <InfoPanel
          bar={activeBar}
          sidebarOpen={sidebarOpen}
          isVisited={!!visitedMap[String(activeBar.id)]}
          onClose={handleCloseInfoPanel}
          onOpenRoute={handleOpenRoute}
          onToggleVisited={handleToggleVisited}
        />
      )}

      {/* ── Painel de rota ── */}
      {routeOpen && activeBar && (
        <RoutePanel
          bar={activeBar}
          travelMode={travelMode}
          userLocation={userLocation}
          onClose={handleCloseRoute}
          onTravelModeChange={setTravelMode}
        />
      )}
    </>
  );
}
