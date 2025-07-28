const platforms = [
  'GitHub repo', 'GitHub org/user', 'PyPI package', 'Homebrew cask/formula', 'Rust crate',
  'npm package', 'npm org', 'Ruby gem', 'Nuget package', 'Packagist package', 'Go package'
] as const

const getPlatformLink = (platform: typeof platforms[number], name: string): string => {
  switch (platform) {
    case 'GitHub repo':
      return `https://github.com/${name}`;
    case 'GitHub org/user':
      return `https://github.com/${name}`;
    case 'PyPI package':
      return `https://pypi.org/project/${name}`;
    case 'Homebrew cask/formula':
      return `https://formulae.brew.sh/formula/${name}`;
    case 'Rust crate':
      return `https://crates.io/crates/${name}`;
    case 'npm package':
      return `https://www.npmjs.com/package/${name}`;
    case 'npm org':
      return `https://www.npmjs.com/org/${name}`;
    case 'Ruby gem':
      return `https://rubygems.org/gems/${name}`;
    case 'Nuget package':
      return `https://www.nuget.org/packages/${name}`;
    case 'Packagist package':
      return `https://packagist.org/packages/${name}`;
    case 'Go package':
      return `https://pkg.go.dev/${name}`;
    default:
      return '#';
  }
}

async function fetchPlatformAvailability(platform: typeof platforms[number], name: string) {
  try {
    switch (platform) {
      case 'GitHub repo': {
        const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(name)}+in:name`, {
          headers: {
            'User-Agent': 'toolkit.pavi2410.me'
          }
        })
        const data = await res.json()
        return data.items.filter((item: any) => name.localeCompare(item.name, undefined, {
          sensitivity: 'base'
        })).length > 0
      }

      case 'GitHub org/user': {
        const res = await fetch(`https://api.github.com/users/${name}`, {
          headers: {
            'User-Agent': 'toolkit.pavi2410.me'
          }
        })
        return res.status === 404
      }

      case 'PyPI package': {
        const res = await fetch(`https://pypi.org/pypi/${name}/json`)
        return res.status === 404
      }

      case 'Homebrew cask/formula': {
        const res = await fetch(`https://formulae.brew.sh/api/formula/${name}.json`)
        return res.status === 404
      }

      case 'Rust crate': {
        const res = await fetch(`https://crates.io/api/v1/crates/${name}`)
        return res.status === 404
      }

      case 'npm package': {
        const res = await fetch(`https://registry.npmjs.org/${name}`)
        return res.status === 404
      }

      case 'npm org': {
        const res = await fetch(`https://www.npmjs.com/org/${name}`)
        return res.status === 404
      }

      case 'Ruby gem': {
        const res = await fetch(`https://rubygems.org/api/v1/gems/${name}.json`)
        return res.status === 404
      }

      case 'Nuget package': {
        const res = await fetch(`https://api.nuget.org/v3/registration5-gz-semver1/${name}/index.json`)
        return res.status === 404
      }

      case 'Packagist package': {
        const res = await fetch(`https://repo.packagist.org/p2/${name}.json`)
        return res.status === 404
      }

      case 'Go package': {
        const res = await fetch(`https://pkg.go.dev/${name}?tab=overview`)
        return res.status === 404
      }

      default: {
        return false
      }
    }
  } catch {
    throw new Error('Failed to check platform availability')
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  if (!query.name || !query.platform) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing name or platform parameter'
    })
  }

  const platform = query.platform as typeof platforms[number]
  const name = query.name as string

  if (!platforms.includes(platform)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid platform'
    })
  }

  try {
    const available = await fetchPlatformAvailability(platform, name)
    const link = getPlatformLink(platform, name)
    
    return { 
      platform, 
      available, 
      link,
      status: 'success' as const
    }
  } catch (error) {
    return {
      platform,
      available: false,
      link: getPlatformLink(platform, name),
      status: 'error' as const
    }
  }
})