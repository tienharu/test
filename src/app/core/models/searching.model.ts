
export class SearchingModel {
  id: number
  Company_id: number
  menu_id: number
  menu_name: string
  program_cd: string
  ref_id: number
  ref_code: number
  created_by: string
  data_content: string
  data_content_splited: string[] = []
}
export class SearchResultGroupByConvertedModel {
  menu_id: string
  menu_name: string
  program_cd: string
  count_result: number
  result_search_of__menu: SearchingModel[] = []
  isActiveTab: boolean
}