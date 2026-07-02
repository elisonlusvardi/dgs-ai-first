param(
    [string]$ConfigPath = ".mcp/mcp.json",
    [switch]$StrictExecutable
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$script:HasCriticalFailure = $false
$script:HasWarning = $false

function Write-Status {
    param(
        [Parameter(Mandatory = $true)][ValidateSet("PASS", "WARN", "FAIL", "INFO")][string]$Level,
        [Parameter(Mandatory = $true)][string]$Message
    )

    switch ($Level) {
        "PASS" { Write-Host "[PASS] $Message" -ForegroundColor Green }
        "WARN" { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
        "FAIL" { Write-Host "[FAIL] $Message" -ForegroundColor Red }
        default { Write-Host "[INFO] $Message" }
    }
}

function Resolve-ConfigPath {
    param([string]$Path)

    if ([System.IO.Path]::IsPathRooted($Path)) {
        return $Path
    }

    return Join-Path (Get-Location) $Path
}

function Is-ArrayLike {
    param($Value)

    if ($null -eq $Value) {
        return $false
    }

    return ($Value -is [System.Array]) -or ($Value -is [System.Collections.IEnumerable] -and -not ($Value -is [string]))
}

function Validate-ServerDefinition {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)]$Definition
    )

    $serverCritical = $false

    if ($null -eq $Definition) {
        Write-Status -Level "FAIL" -Message "Server '$Name' sem definição."
        return $true
    }

    $command = $Definition.command
    $args = $null

    if ($null -ne $Definition.args) {
        $args = $Definition.args
    } elseif ($null -ne $Definition.arguments) {
        $args = $Definition.arguments
    }

    if ([string]::IsNullOrWhiteSpace([string]$command)) {
        Write-Status -Level "FAIL" -Message "Server '$Name' sem campo obrigatório 'command'."
        $serverCritical = $true
    }

    if (-not (Is-ArrayLike -Value $args)) {
        Write-Status -Level "FAIL" -Message "Server '$Name' sem 'args' (ou 'arguments') em formato de lista."
        $serverCritical = $true
    }

    if (-not $serverCritical) {
        $commandExists = $null -ne (Get-Command -Name $command -ErrorAction SilentlyContinue)

        if ($commandExists) {
            Write-Status -Level "PASS" -Message "Server '$Name': command '$command' encontrado."
        } else {
            if ($StrictExecutable) {
                Write-Status -Level "FAIL" -Message "Server '$Name': command '$command' não encontrado no PATH (modo estrito)."
                $serverCritical = $true
            } else {
                Write-Status -Level "WARN" -Message "Server '$Name': command '$command' não encontrado no PATH."
                $script:HasWarning = $true
            }
        }

        $argsCount = @($args).Count
        if ($argsCount -gt 0) {
            Write-Status -Level "PASS" -Message "Server '$Name': args presentes ($argsCount)."
        } else {
            Write-Status -Level "WARN" -Message "Server '$Name': args vazios; validar necessidade."
            $script:HasWarning = $true
        }

        if ($Name -eq "filesystem") {
            $missingPaths = @()
            foreach ($arg in @($args)) {
                if ($arg -is [string] -and ($arg.StartsWith("./") -or $arg.StartsWith(".\\") -or $arg.StartsWith("/"))) {
                    $resolved = Resolve-Path -Path $arg -ErrorAction SilentlyContinue
                    if ($null -eq $resolved) {
                        $missingPaths += $arg
                    }
                }
            }

            if ($missingPaths.Count -gt 0) {
                Write-Status -Level "FAIL" -Message "Server '$Name': paths não encontrados: $($missingPaths -join ', ')."
                $serverCritical = $true
            } else {
                Write-Status -Level "PASS" -Message "Server '$Name': paths de escopo válidos."
            }
        }
    }

    return $serverCritical
}

$configFullPath = Resolve-ConfigPath -Path $ConfigPath
Write-Status -Level "INFO" -Message "Configuração alvo: $configFullPath"

if (-not (Test-Path -Path $configFullPath -PathType Leaf)) {
    Write-Status -Level "FAIL" -Message "Arquivo não encontrado: $configFullPath"
    exit 1
}

try {
    $rawJson = Get-Content -Path $configFullPath -Raw -Encoding UTF8
} catch {
    Write-Status -Level "FAIL" -Message "Falha ao ler arquivo: $($_.Exception.Message)"
    exit 1
}

if ([string]::IsNullOrWhiteSpace($rawJson)) {
    Write-Status -Level "FAIL" -Message "Arquivo de configuração vazio: $configFullPath"
    exit 1
}

try {
    $config = $rawJson | ConvertFrom-Json -ErrorAction Stop
} catch {
    Write-Status -Level "FAIL" -Message "JSON inválido em '$configFullPath': $($_.Exception.Message)"
    exit 1
}

if ($null -eq $config.mcpServers) {
    Write-Status -Level "FAIL" -Message "Campo obrigatório ausente: mcpServers"
    exit 1
}

$properties = @($config.mcpServers.PSObject.Properties)
if ($properties.Count -eq 0) {
    Write-Status -Level "FAIL" -Message "mcpServers está vazio em '$configFullPath'. Configure ao menos um server."
    exit 1
}

Write-Status -Level "INFO" -Message "Servers encontrados: $($properties.Count)"

foreach ($prop in $properties) {
    $name = $prop.Name
    $definition = $prop.Value
    Write-Status -Level "INFO" -Message "Validando server '$name'..."

    $isCritical = Validate-ServerDefinition -Name $name -Definition $definition
    if ($isCritical) {
        $script:HasCriticalFailure = $true
    }
}

if ($script:HasCriticalFailure) {
    Write-Status -Level "FAIL" -Message "Health check concluído com falhas críticas."
    exit 1
}

if ($script:HasWarning) {
    Write-Status -Level "WARN" -Message "Health check concluído com avisos (sem falhas críticas)."
    exit 0
}

Write-Status -Level "PASS" -Message "Health check concluído sem falhas."
exit 0
