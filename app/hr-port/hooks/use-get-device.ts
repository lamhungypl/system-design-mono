import { useResponsive } from "ahooks"

export default function useGetDevice() {
  const { xs, sm, md, lg, xl, "2xl": xxl } = useResponsive()

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    smallMobile: xs && !sm,
    smallMobileAndSmaller: !sm,
    smallMobileAndBigger: xs,
    largeMobile: sm && !md,
    largeMobileAndSmaller: !md,
    largeMobileAndBigger: sm,
    tablet: md && !lg,
    tabletAndBigger: md,
    tabletAndSmaller: !lg,
    desktop: lg && !xl,
    desktopAndBigger: lg,
    desktopAndSmaller: !xl,
    largeDesktop: xl && !xxl,
    largeDesktopAndBigger: xl,
    largeDesktopAndSmaller: !xxl,
  }
}
