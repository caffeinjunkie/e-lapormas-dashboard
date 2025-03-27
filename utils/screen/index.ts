export const calculateAdminRow = (setRowsPerPage: (rows: number) => void) => {
  const height = window.innerHeight;
  const orientation = window.screen.orientation.type;

  if (
    orientation === "portrait-primary" ||
    orientation === "portrait-secondary"
  ) {
    setRowsPerPage(
      height >= 1100 ? Math.floor(height / 100) : height >= 1024 ? 6 : 5,
    );
  } else {
    setRowsPerPage(height > 884 ? Math.floor(height / 110) : 6);
  }
};

export const calculateReportRow = (
  setRowsPerPage: (rows: number) => void,
  isMobile: boolean,
  isWideScreen: boolean,
) => {
  setRowsPerPage(isWideScreen ? 8 : isMobile ? 10 : 5);
};
