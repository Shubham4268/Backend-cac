
function UserComponent({user}) {
  const currUser = user
  
  return (
    <div>{currUser?.fullName}</div>
  )
}

export default UserComponent