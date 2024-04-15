const height = {
    appBar: 12,
    tab: 12,
  };
  
  const color = {
    main: "blue-500",
    mainRgb: "#203682",
    mainLight: "blue-200",
    mainLightRgb: "#203682",
    background: "white",
  };
  
  const page = {
    base: "flex-1 flex flex-col w-full",
    body: "flex-1 flex flex-col overflow-scroll w-full",
    margin: {
      top: `mt-${height.appBar}`,
      topWithTab: `mt-${height.appBar + height.tab}`,
      bottom: "mb-[56px]",
    }
  };
  
  const component = {
    signIn: {
      notification: `my-16 text-center text-${color.main}`,
      buttonWrapper: "flex flex-col my-12",
    },
  };
  
  
  const classNames = {
    color,
    page,
    component,
  };
  
  export default classNames;