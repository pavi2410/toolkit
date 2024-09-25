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
  switch (platform) {
    case 'GitHub repo': {
      const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(`/${name}$/`)}+in:name`)
      const data = await res.json()
      return data.total_count === 0
    }

    case 'GitHub org/user': {
      const res = await fetch(`https://api.github.com/users/${name}`)
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
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return Promise.all(platforms.map(async (platform) => {
    const platformLink = getPlatformLink(platform, query.name as string)
    const available = await fetchPlatformAvailability(platform, query.name as string)
    return { platform, available, link: platformLink }
  }))
})
