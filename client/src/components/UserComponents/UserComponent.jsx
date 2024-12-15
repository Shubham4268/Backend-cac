
function UserComponent({user}) {
  const currUser = user
  console.log(currUser);
  
  return (
    <div>{currUser?.fullName}</div>
  )
}

export default UserComponent