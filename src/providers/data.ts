import { BACKEND_BASE_URL } from '@/constants'
import { ListResponse } from '@/types'
import { createDataProvider, CreateDataProviderOptions} from '@refinedev/rest'

if (!BACKEND_BASE_URL) {
  throw new Error('Backend url not found.')
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,
    // For functional filters 
    buildQueryParams: async ({resource, pagination, filters}) => {
      const page = pagination?.currentPage ?? 1
      const pageSize = pagination?.pageSize ?? 10

      const params: Record<string, string | number> = { page, limit: pageSize}

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : ''

        // Convert value to string for query params
        const value = String(filter.value)

        if(resource === 'subjects') {
          if(field === 'departments' || field === 'department' || field === 'departments.name') {
            params.department = value
          }
          if(field === 'name' || field === 'code') {
            params.search = value
          }
        }
      })
      return params;
    },
    mapResponse: async (response) => {
      const payload: ListResponse = await response.clone().json()

      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.clone().json()

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    }
  }
}

export const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options)

// export { dataProvider };