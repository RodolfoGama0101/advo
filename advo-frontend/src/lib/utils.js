import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Format currency to BRL
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Format date to Brazilian standard (dd/MM/yyyy)
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = parseISO(dateString)
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  } catch (error) {
    return dateString
  }
}

// Format date and time (dd/MM/yyyy HH:mm)
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '-'
  try {
    const date = parseISO(dateTimeString)
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch (error) {
    return dateTimeString
  }
}

// Strip non-numeric characters (useful for API submission)
export const cleanNumbers = (str) => {
  if (!str) return ''
  return str.replace(/\D/g, '')
}

// Format CPF (000.000.000-00)
export const formatCPF = (val) => {
  const clean = cleanNumbers(val)
  return clean
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    .substring(0, 14)
}

// Format CNPJ (00.000.000/0000-00)
export const formatCNPJ = (val) => {
  const clean = cleanNumbers(val)
  return clean
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
    .substring(0, 18)
}

// Format CPF or CNPJ automatically based on length
export const formatCpfCnpj = (val) => {
  const clean = cleanNumbers(val)
  if (clean.length <= 11) {
    return formatCPF(clean)
  }
  return formatCNPJ(clean)
}

// Format phone number: (00) 00000-0000 or (00) 0000-0000
export const formatPhone = (val) => {
  const clean = cleanNumbers(val)
  if (clean.length <= 10) {
    return clean
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4})(\d)/g, '$1-$2')
      .substring(0, 14)
  }
  return clean
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/g, '$1-$2')
    .substring(0, 15)
}

// Format CEP (00000-000)
export const formatCEP = (val) => {
  const clean = cleanNumbers(val)
  return clean
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .substring(0, 9)
}

// Merge class names (convenience helper)
export const clsx = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
