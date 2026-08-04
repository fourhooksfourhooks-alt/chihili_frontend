import React, { Suspense } from "react";
import { AddressConent } from "./AddressContent";
import ProtectedRoute from "@/components/RouteProtect";
import ChihiliLoader from "@/components/ChihiliLoader";

const AddressPage = () => {
  return (
    <ProtectedRoute>
      <div>
        <Suspense fallback={<ChihiliLoader message="Loading addresses..." />}>
          <AddressConent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
};

export default AddressPage;
