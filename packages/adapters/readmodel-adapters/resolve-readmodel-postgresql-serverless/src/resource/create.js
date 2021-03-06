const create = async (pool, options) => {
  const { connect, disconnect, escapeId } = pool
  const admin = {}

  await connect(admin, {
    awsSecretStoreArn: options.awsSecretStoreAdminArn,
    dbClusterOrInstanceArn: options.dbClusterOrInstanceArn,
    databaseName: options.databaseName,
    region: options.region
  })

  await admin.executeStatement(
    [
      `CREATE SCHEMA ${escapeId(options.databaseName)}`,

      `CREATE TABLE ${escapeId(options.databaseName)}.${escapeId(
        `__${options.databaseName}__XA__`
      )}(
        "xa_key" VARCHAR(190),
        "timestamp" BIGINT,
        PRIMARY KEY("xa_key")
      )`,

      `GRANT USAGE ON SCHEMA ${escapeId(options.databaseName)} TO ${escapeId(
        options.userLogin
      )}`,

      `GRANT ALL ON SCHEMA ${escapeId(options.databaseName)} TO ${escapeId(
        options.userLogin
      )}`,

      `GRANT ALL ON ALL TABLES IN SCHEMA ${escapeId(
        options.databaseName
      )} TO ${escapeId(options.userLogin)}`,

      `GRANT ALL ON ALL SEQUENCES IN SCHEMA ${escapeId(
        options.databaseName
      )} TO ${escapeId(options.userLogin)}`,

      `GRANT ALL ON ALL FUNCTIONS IN SCHEMA ${escapeId(
        options.databaseName
      )} TO ${escapeId(options.userLogin)}`,

      `ALTER SCHEMA ${escapeId(options.databaseName)} OWNER TO ${escapeId(
        options.userLogin
      )}`
    ].join('; ')
  )

  await disconnect(admin)
}

export default create
