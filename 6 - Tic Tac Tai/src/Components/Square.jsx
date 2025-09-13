import { motion } from "framer-motion"

const Square = ({val , onClick}) => {
  return (
    <motion.button
        className='w-[90px] h-[90px] bg-[#1E293B] flex items-center justify-center rounded text-2xl font-medium'
        onClick={onClick}
        whileTap={{scale:0.9}}
      >
        {val}
    </motion.button>
  )
}

export default Square