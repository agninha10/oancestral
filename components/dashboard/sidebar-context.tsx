'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

const STORAGE_KEY = 'dashboard-sidebar-collapsed';

interface SidebarContextValue {
    collapsed: boolean;
    toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
    collapsed: false,
    toggle: () => {},
});

export function useSidebar() {
    return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    // Restore persisted state after mount (avoids SSR mismatch)
    useEffect(() => {
        try {
            setCollapsed(localStorage.getItem(STORAGE_KEY) === 'true');
        } catch {}
    }, []);

    const toggle = useCallback(() => {
        setCollapsed((v) => {
            const next = !v;
            try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
            return next;
        });
    }, []);

    return (
        <SidebarContext.Provider value={{ collapsed, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
}
