import UpdateUserDetailsForm from "@/components/form/UpdateUserDetailsForm";

const EditProfile = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-xl mx-auto">
      <UpdateUserDetailsForm params={params} />
    </div>
  );
};

export default EditProfile;
