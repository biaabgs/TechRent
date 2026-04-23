import {
  ActivityIcon,
  ClipboardListIcon,
  FolderKanbanIcon,
  HomeIcon,
  LayoutGridIcon,
  MonitorCogIcon,
  ShieldCheckIcon,
  TicketPlusIcon,
  WrenchIcon,
} from "lucide-react";
import { getHomeByRole } from "@/lib/route-guard";

const ROLE_META = {
  admin: {
    label: "Administrador",
    description: "Gestao geral da operacao e dos equipamentos.",
    primaryAction: {
      href: "/admin",
      label: "Dashboard",
      icon: <MonitorCogIcon />,
    },
  },
  tecnico: {
    label: "Tecnico",
    description: "Acompanhe a fila tecnica e registre manutencoes.",
    primaryAction: {
      href: "/tecnico/manutencao/nova",
      label: "Registrar manutencao",
      icon: <WrenchIcon />,
    },
  },
  cliente: {
    label: "Cliente",
    description: "Abra chamados e acompanhe seus atendimentos.",
    primaryAction: {
      href: "/cliente/chamados/novo",
      label: "Novo chamado",
      icon: <TicketPlusIcon />,
    },
  },
};

const NAVIGATION = {
  admin: [
    {
      label: "Visao Geral",
      items: [
        {
          title: "Dashboard",
          path: "/admin/dashboard",
          icon: <LayoutGridIcon />,
          matchStartsWith: true,
        },
      ],
    },
    {
      label: "Operacao",
      items: [
        {
          title: "Equipamentos",
          path: "/admin/equipamentos",
          icon: <MonitorCogIcon />,
          matchStartsWith: true,
        },
        {
          title: "Chamados do cliente",
          path: "/cliente/chamados",
          icon: <ClipboardListIcon />,
          matchStartsWith: true,
        },
      ],
    },
  ],
  tecnico: [
    {
      label: "Visao Geral",
      items: [
        {
          title: "Dashboard",
          path: "/tecnico/dashboard",
          icon: <LayoutGridIcon />,
          matchStartsWith: true,
        },
        {
          title: "Fila tecnica",
          path: "/tecnico/fila",
          icon: <FolderKanbanIcon />,
          matchStartsWith: true,
        },
      ],
    },
    {
      label: "Atendimento",
      items: [
        {
          title: "Manutencoes",
          path: "/tecnico/manutencao",
          icon: <WrenchIcon />,
          matchStartsWith: true,
          subItems: [
            {
              title: "Historico",
              path: "/tecnico/manutencao",
              matchStartsWith: false,
            },
            {
              title: "Registrar manutencao",
              path: "/tecnico/manutencao/nova",
              matchStartsWith: true,
            },
          ],
        },
      ],
    },
  ],
  cliente: [
    {
      label: "Visao Geral",
      items: [
        {
          title: "Dashboard",
          path: "/cliente/dashboard",
          icon: <LayoutGridIcon />,
          matchStartsWith: true,
        },
      ],
    },
    {
      label: "Chamados",
      items: [
        {
          title: "Meus chamados",
          path: "/cliente/chamados",
          icon: <ClipboardListIcon />,
          matchStartsWith: true,
          subItems: [
            {
              title: "Lista",
              path: "/cliente/chamados",
              matchStartsWith: false,
            },
            {
              title: "Novo chamado",
              path: "/cliente/chamados/novo",
              icon: <TicketPlusIcon />,
              matchStartsWith: true,
            },
          ],
        },
      ],
    },
  ],
};

const FOOTER_LINKS = [
  {
    title: "Inicio",
    path: "/",
    icon: <HomeIcon/>,
    matchStartsWith: false,
  }
];

function isActivePath(pathname, path, matchStartsWith = true) {
  if (!pathname || !path) return false;
  if (pathname === path) return true;
  return matchStartsWith && pathname.startsWith(`${path}/`);
}

function withActiveState(item, pathname) {
  const subItems = item.subItems?.map((subItem) => ({
    ...subItem,
    isActive: isActivePath(pathname, subItem.path, subItem.matchStartsWith),
  }));

  return {
    ...item,
    subItems,
    isActive:
      isActivePath(pathname, item.path, item.matchStartsWith) ||
      subItems?.some((subItem) => subItem.isActive) ||
      false,
  };
}

export function getRoleMeta(role = "cliente") {
  return ROLE_META[role] || ROLE_META.cliente;
}

export function getPrimaryAction(role = "cliente") {
  return getRoleMeta(role).primaryAction;
}

export function getNavGroups(role = "cliente", pathname = "") {
  return (NAVIGATION[role] || NAVIGATION.cliente).map((group) => ({
    ...group,
    items: group.items.map((item) => withActiveState(item, pathname)),
  }));
}

export function getFooterNavLinks(pathname = "") {
  return FOOTER_LINKS.map((item) => ({
    ...item,
    isActive: isActivePath(pathname, item.path, item.matchStartsWith),
  }));
}

export function getPageInfo(pathname = "", role = "cliente") {
  const allItems = [
    ...getNavGroups(role, pathname).flatMap((group) =>
      group.items.flatMap((item) => (item.subItems?.length ? [item, ...item.subItems] : [item]))
    ),
    ...getFooterNavLinks(pathname),
  ];

  const activeItem = allItems.find((item) => item.isActive);
  const roleMeta = getRoleMeta(role);

  return {
    section: activeItem?.path === getHomeByRole(role) ? roleMeta.label : activeItem?.title || roleMeta.label,
    title: activeItem?.title || "Painel",
    icon: activeItem?.icon || <LayoutGridIcon />,
    description: roleMeta.description,
  };
}
