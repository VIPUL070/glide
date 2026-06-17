interface AuthModalProps {
  open: boolean;
  onClose: () => void
}

const AuthModal = ({open,onClose}: AuthModalProps) => {
  return (
    <div>AuthModal</div>
  )
}

export default AuthModal