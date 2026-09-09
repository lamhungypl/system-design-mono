import { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"

import { useFieldsInfo } from "~/hr-port/features/profiles/providers/FieldsInfoProvider"
import { useLanguage } from "~/hr-port/lib/language/hooks/use-language"
import { getSelectOptions, isData } from "~/hr-port/utils/object"

import FormSelect, { FormSelectProps } from "../form-select/form-select"
import { useAddressQuery } from "./api/get-address.query"

export type FormAddressSectionProps = {
  className?: string
  compareMode?: boolean
  countryProps: FormSelectProps
  districtProps: FormSelectProps
  file_path: string
  provinceProps: FormSelectProps
  service_path: string
  subdistrictProps: FormSelectProps
  vertical?: boolean
}

const FormAddressSection = (props: FormAddressSectionProps) => {
  const {
    file_path,
    service_path,
    countryProps,
    districtProps,
    provinceProps,
    subdistrictProps,
    vertical,
    compareMode = false,
    className,
  } = props
  const { language: currentLang } = useLanguage()

  const { data: addresses } = useAddressQuery({
    file_path,
    service_path,
  })
  const form = useFormContext()

  const { visibleFieldMap } = useFieldsInfo()

  const countryValue = useWatch({
    control: form.control,
    name: countryProps.name,
  })
  const provinceValue = useWatch({
    control: form.control,
    name: provinceProps.name,
  })
  const districtValue = useWatch({
    control: form.control,
    name: districtProps.name,
  })

  useEffect(() => {
    if (!isData(addresses) || countryValue) return
    form.setValue(countryProps.name, addresses[0].id)
  }, [form, addresses, countryProps, countryValue])

  const countries = useMemo(() => {
    if (!isData(addresses)) return []
    return addresses
  }, [addresses])

  const provinces = useMemo(() => {
    if (!countryValue) return []
    const result = countries.find((country) => country.id === countryValue)
    if (!result) return []
    return result.provinces
  }, [countries, countryValue])

  const districts = useMemo(() => {
    if (!provinceValue) return []
    const result = provinces.find((province) => province.id === provinceValue)
    if (!result) return []
    return result.districts
  }, [provinces, provinceValue])

  const subDistricts = useMemo(() => {
    if (!districtValue) return []
    const result = districts.find((district) => district.id === districtValue)
    if (!result) return []
    return result.sub_districts
  }, [districts, districtValue])

  const countryOptions = useMemo(() => {
    return getSelectOptions({
      data: countries,
      labelAccessor: `name_${currentLang}`,
      fallbackLabelAccessor: `name_en`,
      valueAccessor: "id",
    }).sort((a, b) => a.label.localeCompare(b.label))
  }, [countries, currentLang])

  const provinceOptions = useMemo(() => {
    return getSelectOptions({
      data: provinces,
      labelAccessor: `name_${currentLang}`,
      fallbackLabelAccessor: `name_en`,
      valueAccessor: "id",
    }).sort((a, b) => a.label.localeCompare(b.label))
  }, [provinces, currentLang])

  const districtOptions = useMemo(() => {
    return getSelectOptions({
      data: districts,
      labelAccessor: `name_${currentLang}`,
      fallbackLabelAccessor: `name_en`,
      valueAccessor: "id",
    }).sort((a, b) => a.label.localeCompare(b.label))
  }, [districts, currentLang])

  const subDistrictOptions = useMemo(() => {
    return getSelectOptions({
      data: subDistricts,
      labelAccessor: `name_${currentLang}`,
      fallbackLabelAccessor: `name_en`,
      valueAccessor: "id",
    }).sort((a, b) => a.label.localeCompare(b.label))
  }, [subDistricts, currentLang])

  return (
    <>
      {visibleFieldMap?.[countryProps.name] !== false && (
        <>
          {compareMode && (
            <div className="text-xs break-words">{countryProps.label}</div>
          )}
          <FormSelect
            {...countryProps}
            label={compareMode ? "" : countryProps.label}
            options={countryOptions}
            vertical={vertical}
            className={className}
          />
        </>
      )}
      {visibleFieldMap?.[provinceProps.name] !== false && (
        <>
          {compareMode && (
            <div className="text-xs break-words">{provinceProps.label}</div>
          )}
          <FormSelect
            {...provinceProps}
            label={compareMode ? "" : provinceProps.label}
            options={provinceOptions}
            onChange={() => {
              form.setValue(districtProps.name, "")
              form.setValue(subdistrictProps.name, "")
            }}
            vertical={vertical}
            className={className}
          />
        </>
      )}
      {visibleFieldMap?.[districtProps.name] !== false && (
        <>
          {compareMode && (
            <div className="text-xs break-words">{districtProps.label}</div>
          )}
          <FormSelect
            {...districtProps}
            label={compareMode ? "" : districtProps.label}
            options={districtOptions}
            onChange={() => {
              form.setValue(subdistrictProps.name, "")
            }}
            vertical={vertical}
            className={className}
          />
        </>
      )}

      {visibleFieldMap?.[subdistrictProps.name] !== false && (
        <>
          {compareMode && (
            <div className="text-xs break-words">{subdistrictProps.label}</div>
          )}
          <FormSelect
            {...subdistrictProps}
            label={compareMode ? "" : subdistrictProps.label}
            options={subDistrictOptions}
            vertical={vertical}
            className={className}
          />
        </>
      )}
    </>
  )
}

export default FormAddressSection
