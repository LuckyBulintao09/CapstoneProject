import HostingContentLayout from '@/modules/hosting/components/ContentLayout'
import CustomBreadcrumbs from '@/modules/hosting/components/CustomBreadcrumbs'


function AddPropertyPage() {
  return (
      <div>
          <HostingContentLayout title="Add property">
              <CustomBreadcrumbs />

              <div className="mx-auto max-w-5xl py-11">Step 1</div>
          </HostingContentLayout>
      </div>
  );
}

export default AddPropertyPage