import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/tokens.css';
import { LocalStorageService } from '@/services/storage/LocalStorageService';
import { createLearningStore } from '@/store/useLearningStore';
import type { LearningStore } from '@/store/useLearningStore';

import { App } from './App';

/**
 * Composition root — wire concrete dependencies and mount the app.
 *
 * Only this file knows about concrete implementations (LocalStorageService, ForceLayoutEngine).
 * The rest of the app depends on interfaces.
 */
const storage = new LocalStorageService();
const useLearningStore = createLearningStore(storage);

function Root(): React.JSX.Element {
  const store = useLearningStore() as LearningStore;

  // Hydrate on first render
  React.useEffect(() => {
    void store.hydrate(storage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <App store={store} />;
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
