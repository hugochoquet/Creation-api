import React from "react";
import { Routes, Route } from "react-router-dom";

import { Layout, Home, Service, Contact } from "@/pages/Public";
import Error from "@/_utils/Error";

const PublicRouter = () => {
   return (
      <Routes>
         <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/service" element={<Service />} />
            <Route path="/contact" element={<Contact />} />

            <Route index element={<Home />} />
         </Route>
         <Route path="*" element={<Error />} />
      </Routes>
   );
};

export default PublicRouter;
