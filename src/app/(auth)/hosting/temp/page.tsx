"use client"
import { usePropertyAddFormContext } from "@/modules/hosting/unit/UnitAddFormProvider";

function Property() {

    const { formData } = usePropertyAddFormContext();
    return <div>
        <pre><code>{JSON.stringify({ formData }, null, 2)}</code></pre>
    </div>;
}

export default Property;
