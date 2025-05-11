import type { ThemeConfig } from "antd"
import { presetPalettes } from "@ant-design/colors" // Cập nhật import

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: presetPalettes.blue[5], // Sử dụng presetPalettes thay vì blue
  },
}

export default theme