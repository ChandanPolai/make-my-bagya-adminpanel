let buttons = {
  ".btn-primary": {
    padding: "0.4rem 1rem",
    backgroundColor: "#09af72",
    color: "#fff",
    fontWeight: "400",
    borderRadius: "0.375rem",
    transition: "all 0.3s ease",
    transform: "scale(1)",
    "&:hover": {
      backgroundColor: "#088e5b",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(9, 175, 114, 0.3)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(9, 175, 114, 0.3)",
    },
    "&:active": {
      backgroundColor: "#06784d",
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: "#00794b",
      color: "#fff",
      cursor: "not-allowed",
      opacity: "0.6",
      transform: "scale(1)",
    },
  },
  ".btn-theme": {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#ffffff",
    backgroundColor: "#2b435b", // or dynamic via your theme
    borderRadius: "0.5rem",
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: "0.9",
    },
  },
  ".btn-export": {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#ffffff",
    backgroundColor: "#2f5378", // or dynamic via your theme
    borderRadius: "0.5rem",
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: "0.9",
    },
  },
  ".btn-outline-primary": {
    padding: "0.35rem 1rem",
    backgroundColor: "transparent",
    color: "#09af72",
    fontWeight: "400",
    borderRadius: "0.375rem",
    border: "1px solid #09af72",
    transition: "all 0.3s ease",
    transform: "scale(1)",
    "&:hover": {
      backgroundColor: "#09af72",
      color: "#fff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(9, 175, 114, 0.2)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(9, 175, 114, 0.3)",
    },
    "&:active": {
      backgroundColor: "#06784d",
      color: "#fff",
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: "transparent",
      color: "#09af72",
      cursor: "not-allowed",
      opacity: "0.6",
      transform: "scale(1)",
    },
  },
  ".btn-outline-secondary": {
    padding: "0.35rem 1rem",
    backgroundColor: "transparent",
    color: "#6c757d",
    fontWeight: "400",
    borderRadius: "0.375rem",
    border: "1px solid #6c757d",
    transition: "all 0.3s ease",
    transform: "scale(1)",
    "&:hover": {
      backgroundColor: "#6c757d",
      color: "#fff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(108, 117, 125, 0.2)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(108, 117, 125, 0.3)",
    },
    "&:active": {
      backgroundColor: "#6c757d",
      color: "#fff",
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: "transparent",
      color: "#6c757d",
      cursor: "not-allowed",
      opacity: "0.6",
      transform: "scale(1)",
    },
  },
  ".btn-secondary": {
    padding: "0.35rem 1rem",
    backgroundColor: "#6c757d",
    color: "#fff",
    fontWeight: "400",
    borderRadius: "0.375rem",
    transition: "all 0.3s ease",
    transform: "scale(1)",
    "&:hover": {
      backgroundColor: "#5a6268",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(108, 117, 125, 0.3)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(108, 117, 125, 0.3)",
    },
    "&:active": {
      backgroundColor: "#545b62",
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: "#6c757d",
      color: "#fff",
      cursor: "not-allowed",
      opacity: "0.6",
      transform: "scale(1)",
    },
  },
  ".btn-save": {
    padding: "0.4rem 1.5rem",
    backgroundColor: "#3e5d9a",
    color: "#fff",
    fontWeight: "400",
    borderRadius: "0.375rem",
    transition: "all 0.3s ease",
    transform: "scale(1)",
    "&:hover": {
      backgroundColor: "#294479",
      color: "#fff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(62, 93, 154, 0.3)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(62, 93, 154, 0.3)",
    },
    "&:active": {
      backgroundColor: "#294479",
      color: "#fff",
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: "#5d77ab",
      color: "#fff",
      cursor: "not-allowed",
      opacity: "0.6",
      transform: "scale(1)",
    },
  },
  ".btn-outline-save": {
    padding: "0.3rem 0.8rem",
    backgroundColor: "transparent",
    color: "#3e5d9a",
    fontWeight: "400",
    borderRadius: "0.375rem",
    border: "1px solid #3e5d9a",
    transition: "all 0.3s ease",
    transform: "scale(1)",
    "&:hover": {
      backgroundColor: "#3e5d9a",
      color: "#fff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(62, 93, 154, 0.2)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(62, 93, 154, 0.3)",
    },
    "&:active": {
      backgroundColor: "#294479",
      color: "#fff",
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: "transparent",
      opacity: "0.6",
      cursor: "not-allowed",
      transform: "scale(1)",
    },
  },
  ".btn-warning": {
    padding: "0.4rem 1.3rem",
    fontSize: "0.875rem",
    backgroundColor: "#ffb74d",
    color: "#000000",
    fontWeight: "400",
    borderRadius: "0.25rem",
    transition: "all 0.3s ease",
    transform: "scale(1)",
    "&:hover": {
      backgroundColor: "#ff9800",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(255, 183, 77, 0.3)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(255, 183, 77, 0.3)",
    },
    "&:active": {
      backgroundColor: "#f57c00",
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: "#FF9E4D",
      color: "#000000",
      cursor: "not-allowed",
      opacity: "0.6",
      transform: "scale(1)",
    },
  },
  ".btn-view": {
    color: "#7c3aed", // Purple color for view/eye icon
    padding: "0.125rem 6px", // tw-py-[0.5px] tw-px-[6px]
    // marginRight: "0.5rem",   // tw-mr-2
    fontWeight: "700",       // tw-font-bold
    borderRadius: "0",       // not rounded until hover

    transition: "all 0.3s ease",
    "&:hover": {
      color: "#ffffff", // White text on hover
      backgroundColor: "#7c3aed", // Purple background on hover
      borderRadius: "0.375rem", // Rounded corners on hover
      transform: "scale(1.05)", // Slight scale effect
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.3)",
    },
    "&:active": {
      backgroundColor: "#6d28d9", // Darker purple when active
      transform: "scale(0.95)",
    },
    "&:disabled": {
      opacity: "0.6",
      cursor: "not-allowed",
      transform: "scale(1)",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#7c3aed",
        transform: "scale(1)",
      },
    },
  },
  ".btn-edit": {
    color: "#0369a1", // tw-text-blue-800
    padding: "0.125rem 6px", // tw-py-[0.5px] tw-px-[6px]
    // marginRight: "0.5rem",   // tw-mr-2
    fontWeight: "700",       // tw-font-bold
    borderRadius: "0",       // not rounded until hover

    transition: "all 0.3s ease",
    "&:hover": {
      color: "#ffffff",       // hover:tw-text-white
      backgroundColor: "#0369a1", // hover:tw-bg-indigo-900
      borderRadius: "0.375rem",   // hover:tw-rounded-md
    },
  },
  ".btn-delete": {
    padding: "0.125rem 6px", // py-[0.5px] px-1
    color: "#991b1b", // tw-text-red-800
    fontWeight: "700", // tw-font-bold
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#b91c1c", // tw-bg-red-700
      color: "#ffffff",
      borderRadius: "0.375rem", // rounded-sm
    },
    "&:disabled": {
      opacity: "0.6",
      cursor: "not-allowed",
    },
  },
  ".btn-download": {
    color: "#16a34a", // tw-text-blue-800
    padding: "0.125rem 6px", // tw-py-[0.5px] tw-px-[6px]
    // marginRight: "0.5rem",   // tw-mr-2
    fontWeight: "700",       // tw-font-bold
    borderRadius: "0",       // not rounded until hover

    transition: "all 0.3s ease",
    "&:hover": {
      color: "#ffffff",       // hover:tw-text-white
      backgroundColor: "#16a34a", // hover:tw-bg-indigo-900
      borderRadius: "0.375rem",   // hover:tw-rounded-md
    },
  },
};

let system = {
  ".container": {
    maxWidth: "1140px",
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "15px",
    paddingRight: "15px",
  },
  ".container-fluid": {
    width: "96%",
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
  },
  ".bg-glass": {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    "-webkitBackdropFilter": "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    padding: "0rem .2rem",
    color: "white",
  },
};

let formControls = {
  ".form-control": {
    border: "1px solid #ced4da",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    marginTop: "0.2rem",
    // marginBottom: "0.2rem",
    width: "100%",
    fontSize: "0.875rem",
    fontWeight: "400",
    lineHeight: "1.5",
    color: "#3d3d3f",
    backgroundColor: "#fff",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background-color 0.15s ease-in-out",

    "&:focus": {
      outline: "none",
      borderColor: "#09af72",
      boxShadow: "0 0 0 3px rgba(9, 175, 114, 0.1)",
      backgroundColor: "#fff",
    },

    "&:hover": {
      borderColor: "#adb5bd",
    },

    "&:disabled": {
      backgroundColor: "#e9ecef",
      opacity: "0.6",
      cursor: "not-allowed",
    },

    "&:invalid": {
      border: "1px solid #dc3545",
      borderRadius: "0.375rem",
      padding: "0.5rem 0.75rem",
      color: "#dc3545",
      backgroundColor: "#f8d7da",
      "&:focus": {
        borderColor: "#dc3545",
        boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
      },
    },

    "&::placeholder": {
      color: "#6c757d",
      opacity: "0.7",
      fontSize: "0.875rem",
      fontWeight: "400",
    },

    "&:focus::placeholder": {
      color: "#6c757d",
      opacity: "0.5",
    },

    "&:disabled::placeholder": {
      color: "#6c757d",
      opacity: "0.5",
    },
  },

  // Theme-aware form controls
  ".form-control-theme": {
    border: "1px solid #ced4da",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    marginTop: "0.2rem",
    // marginBottom: "0.2rem",
    width: "100%",
    fontSize: "0.875rem",
    fontWeight: "400",
    lineHeight: "1.5",
    color: "#3d3d3f",
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
    position: "relative",

    "&:focus": {
      outline: "none",
      backgroundColor: "#fff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },

    "&:hover": {
      borderColor: "#adb5bd",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },

    "&:disabled": {
      backgroundColor: "#e9ecef",
      opacity: "0.6",
      cursor: "not-allowed",
      transform: "none",
    },

    "&::placeholder": {
      color: "#6c757d",
      opacity: "0.7",
      fontSize: "0.875rem",
      fontWeight: "400",
      transition: "all 0.3s ease",
    },

    "&:focus::placeholder": {
      color: "#6c757d",
      opacity: "0.5",
      transform: "translateY(-2px)",
    },
  },

  // Theme specific focus states - these will be applied dynamically
  ".form-control-theme.theme-blue:focus": {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(59, 130, 246, 0.15)",
  },

  ".form-control-theme.theme-green:focus": {
    borderColor: "#09af72",
    boxShadow: "0 0 0 3px rgba(9, 175, 114, 0.1), 0 4px 12px rgba(9, 175, 114, 0.15)",
  },

  ".form-control-theme.theme-purple:focus": {
    borderColor: "#8b5cf6",
    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1), 0 4px 12px rgba(139, 92, 246, 0.15)",
  },

  ".form-control-theme.theme-orange:focus": {
    borderColor: "#f97316",
    boxShadow: "0 0 0 3px rgba(249, 115, 22, 0.1), 0 4px 12px rgba(249, 115, 22, 0.15)",
  },

  ".form-control-theme.theme-red:focus": {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1), 0 4px 12px rgba(239, 68, 68, 0.15)",
  },

  ".form-control-theme.theme-yellow:focus": {
    borderColor: "#eab308",
    boxShadow: "0 0 0 3px rgba(234, 179, 8, 0.1), 0 4px 12px rgba(234, 179, 8, 0.15)",
  },

  ".form-select": {
    marginTop: "0.2rem",
    // marginBottom: "0.2rem",
    padding: "0.5rem 2.25rem 0.5rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: "400",
    lineHeight: "1.5",
    color: "#3d3d3f",
    backgroundColor: "#fff",
    backgroundPosition: "right 0.75rem center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "16px 12px",
    border: "1px solid #ced4da",
    borderRadius: "0.375rem",
    transition: "all 0.3s ease",
    cursor: "pointer",

    "&:focus": {
      borderColor: "#09af72",
      outline: "0",
      boxShadow: "0 0 0 3px rgba(9, 175, 114, 0.1), 0 4px 12px rgba(9, 175, 114, 0.15)",
      transform: "translateY(-1px)",
    },

    "&:hover": {
      borderColor: "#adb5bd",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },

    "&:disabled": {
      backgroundColor: "#e9ecef",
      opacity: "0.6",
      cursor: "not-allowed",
      transform: "none",
    },

    "&:invalid": {
      borderColor: "#dc3545",
      "&:focus": {
        borderColor: "#dc3545",
        boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
      },
    },
  },

  ".form-control-search": {
    position: "relative",
    width: "100%",
    padding: "0.5rem 0.5rem 0.5rem 2.5rem",
    fontSize: "0.875rem",
    border: "1px solid #ced4da",
    borderRadius: "0.375rem",
    outline: "none",
    backgroundColor: "#fff",
    transition: "all 0.3s ease",

    "&:focus": {
      borderColor: "#09af72",
      boxShadow: "0 0 0 3px rgba(9, 175, 114, 0.1), 0 4px 12px rgba(9, 175, 114, 0.15)",
      transform: "translateY(-1px)",
    },

    "&:hover": {
      borderColor: "#adb5bd",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },

    "&::placeholder": {
      color: "#6c757d",
      opacity: "0.7",
    },
  },

  ".dropdown-menu": {
    border: "none",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
    width: "100%",
    backgroundColor: "#fff",
    animation: "dropdownSlideIn 0.2s ease-out",

    "&:focus": {
      outline: "none",
    },
  },
};

let radioControl = {
  ".radio-control": {
    accentColor: "#09af72",
    padding: "0.3rem",
    transition: "all 0.3s ease",
    transform: "scale(1)",

    "&:hover": {
      accentColor: "#088e5b",
      transform: "scale(1.1)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(9, 175, 114, 0.3)",
    },
    "&:disabled": {
      accentColor: "#00794b",
      opacity: "0.6",
      cursor: "not-allowed",
      transform: "scale(1)",
    },
  },
};

// Enhanced table styles
// Replace your existing tableStyles object with this updated version:

let tableStyles = {
  ".table-enhanced": {
    "& tbody tr": {
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#f8f9fa",
        transform: "scale(1.01)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      },
    },
    "& .status-dropdown": {
      transition: "all 0.3s ease",
      "&:hover .dropdown-content": {
        opacity: "1",
        visibility: "visible",
        transform: "translateY(0)",
      },
    },
  },
  ".table-wrapper": {
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
    marginTop: "1rem",
    marginBottom: "1.5rem",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  ".table-scroll": {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    flex: "1",
    overflow: "auto",
  },
  ".table": {
    minWidth: "100%",
    borderCollapse: "collapse",
    borderSpacing: "0",
  },
  ".thead": {
    position: "sticky",
    top: "0",
    zIndex: "10",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    height: "4rem",
    verticalAlign: "middle",
  },
  // FIXED: Proper table shadow implementation
  ".table-shadow": {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    borderBottom: "2px solid rgba(0, 0, 0, 0.05)",
    position: "relative",



    // Alternative approach - apply shadow to th elements
    "& th": {
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      position: "relative",
      zIndex: "1",
    }
  },
  ".cell": {
    padding: "1rem 1.5rem",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
  },
  ".tbody": {
    backgroundColor: "#ffffff",
    "& tr:not(:last-child)": {
      borderBottom: "1px solid #e5e7eb",
    }
  },
  ".tbody-tr": {
    fontSize: "0.875rem",
    color: "#525355",
    transition: "background-color 0.15s ease-in-out",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
  }
};


// Animation keyframes
let animations = {
  "@keyframes dropdownSlideIn": {
    from: {
      opacity: "0",
      transform: "translateY(-10px) scale(0.95)",
    },
    to: {
      opacity: "1",
      transform: "translateY(0) scale(1)",
    },
  },
  "@keyframes fadeInUp": {
    from: {
      opacity: "0",
      transform: "translateY(20px)",
    },
    to: {
      opacity: "1",
      transform: "translateY(0)",
    },
  },
  "@keyframes pulse": {
    "0%, 100%": {
      opacity: "1",
    },
    "50%": {
      opacity: "0.7",
    },
  },
};

module.exports = {
  ...buttons,
  ...formControls,
  ...radioControl,
  ...system,
  ...tableStyles,
  ...animations,
};