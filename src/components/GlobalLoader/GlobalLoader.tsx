import { useLoader } from '../../hooks/useLoader'
import { Loader } from '../Loader/Loader'

export const GlobalLoader = () => {
  const { isLoading, message } = useLoader()
  
  return (
    <Loader 
      isVisible={isLoading} 
      message={message}
      size="large"
      overlay={true}
    />
  )
}