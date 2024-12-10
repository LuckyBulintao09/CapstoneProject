import { Poppins } from "next/font/google";

const poppinsBold = Poppins({ weight: "800", subsets: ["latin"] });
const poppinsNormal = Poppins({ weight: "300", subsets: ["latin"] });
const Terms = () => {
  return (
    <section className="lg:w-3/5 lg:mt-2 mt-10 mx-6 h-full">
      <div className="p-1 leading-loose tracking-wider">
        <div className={poppinsBold.className}>
          <h1 className="text-2xl">Terms and Conditions</h1>
        </div>
        <div className={poppinsNormal.className}>
          <p className="mt-4 font-medium ">Welcome to UniHomes!</p>
        </div>
        <div className={poppinsNormal.className}>
          <p className="mt-4 font-medium">
            These terms and conditions outline the rules and regulations for the
            use of UniHomes' Website
          </p>
        </div>

        <div className={poppinsNormal.className}>
          <p className="mt-4 font-medium ">
            By accessing this website, we assume you accept these terms and
            conditions. Do not continue to use UniHomes if you do not agree to
            take all of the terms and conditions stated on this page.
          </p>
        </div>

        <div className={poppinsNormal.className}>
          <h1 className="font-bold text-lg mt-8">Terms and Agreements</h1>

          <p className="mt-4">
            <span className="font-bold">1.</span> User Eligibility:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              All users (tenants and lessors) must be at least 18 years old.
            </li>
            <li>
              Users must provide accurate and up-to-date information during
              registration.
            </li>
          </ul>
          <p className="mt-4">
            <span className="font-bold">2.</span> Account Responsibilities:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Users are responsible for maintaining the confidentiality of their
              account details.
            </li>
            <li>
              Any unauthorized use of the account should be reported immediately
              to UniHomes.
            </li>
            <li>
              UniHomes is not responsible for any loss or damage resulting from
              the failure to comply with this responsibility.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">3.</span> Listing Accuracy:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Lessors are required to provide accurate details about their
              property, including photos, room sizes, amenities, and pricing.
            </li>
            <li>
              Misleading information or misrepresentation of the property may
              result in removal from the platform.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">4.</span> Payment Policy:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              All payments will be processed through the UniHomes payment
              gateway, for example, GCash.
            </li>
            <li>
              Users do not need to submit a receipt, as all transactions are
              recorded and confirmed through the gateway.
            </li>
            <li>
              Payment-related inquiries or disputes must be reported to customer
              support within 7 days of the transaction.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">5.</span> Booking and Cancellation:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Tenants can book rooms through the platform, with the booking
              confirmed once the payment has been processed.
            </li>
            <li>
              If you scheduled an onsite visit and a reservation is made for the
              same property before your visit, your onsite visitation will be
              automatically canceled, as the reservation takes priority once
              payment is confirmed. A notification will be sent to you informing
              that the reservation has already been made and your onsite visit
              is now canceled.
            </li>
            <li>
              Cancellation policies, including refunds, will be dictated by the
              lessor and displayed on the listing page.
            </li>
            <li>
              Tenants are advised to review the cancellation policy before
              completing a booking.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">6.</span> Liability:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              UniHomes is not liable for any disputes arising between tenants
              and lessors.
            </li>
            <li>
              The platform only facilitates the connection and transaction
              between the two parties.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">7.</span> Prohibited Activities:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Users may not post false, misleading, or fraudulent listings.
            </li>
            <li>
              Any attempt to misuse the platform for illegal purposes will
              result in account suspension or termination.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">8.</span> Modification of Terms:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              UniHomes reserves the right to update or modify these terms at any
              time.
            </li>
            <li>
              Users will be notified of any significant changes through their
              registered email.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">9.</span> Dispute Resolution:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              UniHomes is not responsible for resolving disputes and remains
              outside of any conflicts between tenants and lessors.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">10.</span> Data Privacy and File
            Uploads:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              As a lessor, you may be required to upload specific documents,
              including your business permit and fire inspection certificate, to
              complete your listing on the UniHomes platform.
            </li>
            <li>
              By uploading these documents, you consent to UniHomes processing
              and storing these files for the sole purpose of fulfilling the
              listing requirements and ensuring compliance with applicable
              regulations.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">11.</span> User Consent:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              By uploading any documents to the UniHomes platform, you
              explicitly consent to the use of your data for the stated purposes
              and agree that it will be handled in accordance with our Privacy
              Policy.
            </li>
          </ul>
        </div>

        <div className={poppinsNormal.className}>
          <h1 className="font-bold text-lg mt-8">
            Policies for Online Booking and Listing of Rooms
          </h1>

          <p className="mt-4">
            <span className="font-bold">1.</span> Verification of Lessors:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Lessors must submit valid identification and proof of property
              ownership or authorization to list the property.
            </li>
            <li>
              Listings will only be made live after the verification process is
              complete.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">2.</span> Listing Guidelines:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Properties listed must meet local safety and health regulations.
            </li>
            <li>
              Lessors must clearly state the price, room features, house rules,
              and other relevant details.
            </li>
            <li>
              Any change to the listing, for example, price updates or
              availability changes, must be immediately reflected on the
              platform.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">3.</span> Online Booking Process:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Tenants can search, filter, and view room listings according to
              their preferences.
            </li>
            <li>
              Once a room is selected, tenants can book it by completing the
              payment through GCash, which acts as the payment gateway.
            </li>
            <li>
              The booking is confirmed once payment is successfully processed,
              and tenants will receive a booking confirmation.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">4.</span> Payment Gateway Integration:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Payments will be made via GCash, with no need for tenants to
              submit receipts.
            </li>
            <li>
              The payment gateway will automatically log and verify payments.
            </li>
            <li>
              Any discrepancies in payment will be handled by the payment
              gateway system in coordination with UniHomes customer support.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">5.</span> Cancellation and Refund
            Policy:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Lessors are responsible for setting clear cancellation policies
              for their listings, including any fees or refund conditions.
            </li>
            <li>
              Tenants can cancel a booking, but they must adhere to the
              cancellation policy provided by the lessor.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">6.</span> Rating and Review System:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Both tenants and lessors can leave feedback and reviews for each
              other after the booking period is complete.
            </li>
            <li>
              Reviews are publicly displayed and contribute to the reputation of
              both the property and the lessor.
            </li>
            <li>
              UniHomes reserves the right to remove any inappropriate reviews
              that violate the community guidelines.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">7.</span> Privacy Policy:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              UniHomes respects user privacy and will not share personal details
              with third parties without consent.
            </li>
            <li>
              Payment details are encrypted, and no sensitive financial
              information is stored on the UniHomes platform.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">8.</span> Support and Disputes:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              In case of any disputes regarding the property, the tenant and
              lessor should first try to resolve the issue directly.
            </li>
            <li>
              If unresolved, the tenant can escalate the issue to UniHomes
              support team for further assistance.
            </li>
          </ul>

          <p className="mt-4">
            <span className="font-bold">9.</span> First Pay, First Reserve:
          </p>
          <ul className="list-disc ml-8 mt-2">
            <li>
              Reservations are confirmed only when payment is completed in full.
              The first tenant to complete the payment for a room or property
              will secure the reservation.
            </li>
            <li>
              Once a property or room is booked and payment is confirmed, it
              will no longer be available for other tenants. Any subsequent
              inquiries for the same property or room will be notified that the
              reservation has already been confirmed.
            </li>
            <li>
              Users who inquire about a property that has already been booked
              will receive an automatic notification informing them that the
              property is no longer available and their inquiry is canceled.
            </li>
            <li>
              To avoid losing their preferred room or property, tenants are
              advised to complete the payment promptly upon confirmation of
              interest.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Terms;
