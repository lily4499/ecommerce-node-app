{{/*
Return the fully qualified app name.
*/}}
{{- define "ecommerce-node-app-chart.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Return the app name.
*/}}
{{- define "ecommerce-node-app-chart.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{/*
Return common labels.
*/}}
{{- define "ecommerce-node-app-chart.labels" -}}
app.kubernetes.io/name: {{ include "ecommerce-node-app-chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}
