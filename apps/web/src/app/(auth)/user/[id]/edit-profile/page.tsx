import UpdateUserDetailsForm from "@/components/form/UpdateUserDetailsForm";

const EditProfile = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <UpdateUserDetailsForm params={params} />
    </div>
  );
};

export default EditProfile;
