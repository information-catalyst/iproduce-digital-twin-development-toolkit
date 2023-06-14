import { useState } from "react";
import Header from "../../components/header/header";
import Model from "../3dModel/3dModel";
import Bpmn from "../bpmn/bpmn";
import { useEffect } from "react";
import { useRef } from "react";

function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector(".App-header");
      const height = header ? header.offsetHeight : 0;
      setHeaderHeight(height);
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const bpmnSectionRef = useRef(null);
  const modelSectionRef = useRef(null);

  const scrollToBpmnSection = () => {
    const bpmnSectionTop = bpmnSectionRef.current.offsetTop;
    window.scrollTo({
      top: bpmnSectionTop - headerHeight - 10,
      behavior: "smooth",
    });
  };

  const scrollToModelSection = () => {
    const modelSectionTop = modelSectionRef.current.offsetTop;
    window.scrollTo({
      top: modelSectionTop - headerHeight - 10,
      behavior: "smooth",
    });
  };

  return (
    <div className="Home">
      <Header
        onBpmnButtonClick={scrollToBpmnSection}
        onModelButtonClick={scrollToModelSection}
      ></Header>
      <div style={{ marginTop: headerHeight + 10 }}>
        <div className="mb-8" ref={bpmnSectionRef} id="bpmnSection">
          <Bpmn></Bpmn>
        </div>
        <div className="mb-8" ref={modelSectionRef} id="modelSection">
          <Model></Model>
        </div>
      </div>
    </div>
  );
}

export default Home;
