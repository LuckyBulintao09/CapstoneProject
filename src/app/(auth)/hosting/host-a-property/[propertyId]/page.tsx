"use client"
import { usePropertyAddFormContext } from "@/modules/hosting/add-listing/PropertyAddFormProvider";

function Property() {

    const { formData } = usePropertyAddFormContext();
    return <div>
        <pre><code>{JSON.stringify({ formData }, null, 2)}</code></pre>
    </div>;
}

export default Property;
